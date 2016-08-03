module Linish
  # use grape module
  module ErrorFormatter
    def self.call message, backtrace, options, env
      if message.is_a?(Hash)
        { error: message[:message], code: message[:code] }.to_json
      else
        { error:message }.to_json
      end
    end
  end

  class API < Grape::API
    version 'v1', using: :path
    format :json
    prefix :api
    error_formatter :json, ErrorFormatter
    use Rack::Session::Cookie, secret: 'change_me'

    # write some helpers here
    helpers do
      def throw_error!(message, error_code, status)
        error!({ message: message, code: error_code }, status)
      end

      # def check_session
      #   p env['rack.session'][:user_id]
      #   return throw_error!('Bad request', 400, 400) if env['rack.session'][:user_id].nil?
      # end

      def login(user_id)
        key = ApiKey.find_by(user_id: user_id)
        key.destroy unless key.nil?
        newKey = ApiKey.create(user_id: user_id)
        { access_token: newKey.access_token }
      end

      def authenticate!
        p "HOGE"
        throw_error!('Unauthorized. Invalid or expired token.', 400, 400) unless current_user
      end

      def current_user
        p params[:access_token]
        access_token = ApiKey.find_by(access_token: params[:access_token])
        p access_token
        unless access_token.nil?
          @current_user = User.find_by(user_id: access_token.user_id)
        else
          false
        end
      end
    end

    resource :accounts do
      desc 'Return user.'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      get do
        authenticate!
        @current_user
      end

      # # route_paramを使うとname spaceのように区切れる
      route_param :user_id do
        desc 'Return a specific user.'
        get do
          user = User.find_by(user_id: params[:user_id])
          if user.nil?
            throw_error!("User doesn't exist.", 400, 400)
          else
           return user
          end
        end
      end

      # route_param :uuid do
      #   desc 'Return a specific user.'
      #   get do
      #     user = User.find_by(uuid: params[:uuid])
      #     throw_error!("User doesn't exist.", 400, 400) if user.nil?
      #   end
      # end

      desc 'Signin to an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :password, type: String, desc: 'user password'
      end
      post :signin do
        user = User.find_by(user_id: params[:user_id])
        doesUserExist = !user.nil?
        isAuthenticated = doesUserExist && user.authenticate(params[:password])
        error = {}
        unless doesUserExist
          error[:user_id] = ["isn't correct"]
          throw_error!(error, 400, 400)
        end

        if isAuthenticated
          login(user.user_id)
        else
          error[:password] = ["isn't correct"]
          throw_error!(error, 400, 400)
        end
      end

      desc 'Signout an account.'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      post :signout do
        authenticate!
        ApiKey.find_by(user_id: @current_user.user_id).destroy
      end

      desc 'Create an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :email, type: String, desc: 'user email'
        requires :password, type: String, desc: 'user password'
      end
      post :signup do
        user = User.new(user_id: params[:user_id], email: params[:email], password: params[:password])
        if user.valid?
          user.save
          login(user.user_id)
        else
          throw_error!(user.errors, 400, 400)
        end
      end

      desc 'Delete an account.'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      post :delete do
        authenticate!
        user = User.find_by(user_id: @current_user.user_id)
        user.destroy
      end
    end

    resource :friends do
      desc 'Get friends.'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      get do
        authenticate!
        followedUsers = []
        followers = Relationship.where(follower_id: @current_user.user_id)
        followers.each do |follower|
          followedUsers.push(follower.followed_id)
        end
        followingUsers = []
        followings = Relationship.where(followed_id: @current_user.user_id)
        followings.each do |following|
          followingUsers.push(following.follower_id)
        end
        friends = followedUsers.concat(followingUsers)
        friends.sort
      end

      desc 'Add friends.'
      params do
        requires :followed_id, type: String, desc: 'followed id'
        requires :access_token, type: String, desc: "access token"
      end
      post :add do
        authenticate!
        followerId = @current_user.user_id
        followedId = params[:followed_id]
        throw_error!("You can't be a friend with yourself", 400, 400) if followerId == followedId
        relationship = Relationship.create(follower_id: followerId, followed_id: followedId)
        errorMessages = relationship.errors.full_messages
        errorMessages = "Already your friend" if errorMessages.instance_of?(Array) && !errorMessages.empty?
        throw_error!(errorMessages, 400, 400) unless errorMessages.empty?
        ActionCable.server.broadcast 'friends',
          follower_id: followerId,
          followed_id: followedId
        relationship
      end

      desc 'Delete friends.'
      params do
        requires :access_token, type: String, desc: "access token"
        requires :user_ids, type: Array, desc: 'user ids'
      end
      post :delete do
        authenticate!
        userIds = params[:user_ids]

        # userIds.push(@current_user.user_id)
        userIds.each do |userId|
          user = Relationship.find_by(follower_id: userId)
          user = Relationship.find_by(followed_id: userId) if user.nil?
          if user.nil?
            throw_error!("can't find friends'", 400, 400)
          else
            deletedId = user.followed_id unless @current_user.user_id == user.followed_id
            deletedId = user.follower_id unless @current_user.user_id == user.follower_id
            ActionCable.server.broadcast 'friends_delete',
              deleting_id: @current_user.user_id,
              deleted_id: deletedId
            user.destroy
          end
        end
      end
    end

    resource :rooms do
      desc 'Return rooms.'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      get do
        authenticate!
        userId = @current_user.user_id
        userRoomsByUser = UserRoom.where(user_id: userId)
        rooms = []
        userRoomsByUser.each do |userRoomByUser|
          roomId = userRoomByUser.room_id
          userRoomsByRoom = UserRoom.where(room_id: roomId)
          updatedAt = Room.find_by(room_id: roomId).updated_at
          users = userRoomsByRoom.map { |userRoomByRoom| userRoomByRoom.user_id }
          users.delete(userId)
          rooms.push({room_id: roomId, updated_at: updatedAt, user_ids: users})
        end
        rooms.sort_by { |room| room[:updated_at] }.reverse!
      end

      # TODO dont let it make a room which exists if it has only one memberId
      desc 'Create a room.'
      params do
        requires :access_token, type: String, desc: "access token"
        requires :member_ids, type: Array, desc: 'user ids'
      end
      post :create do
        authenticate!
        createrId = @current_user.user_id
        memberIds = params[:member_ids]
        throw_error!("can't find user'", 400, 400) if memberIds.empty?
        memberIds.push(createrId)
        room = Room.create
        createdRoom = {}
        users = memberIds.each do |memberId|
          user = User.find_by(user_id: memberId)
          if user.nil?
            room.destroy
            throw_error!("can't find user'", 400, 400)
          else
            user.user_rooms.create(room_id: room.room_id)
          end
        end

        ActionCable.server.broadcast 'room_add',
          room_ids: room.room_id,
          users: users

        createdRoom["room_id"] = room.room_id
        createdRoom["users"] = users
        createdRoom["user_id"] = createrId
        createdRoom
      end

      desc 'delete a room.'
      params do
        requires :access_token, type: String, desc: "access token"
        requires :room_ids, type: Array, desc: 'room ids'
      end
      post :delete do
        p "HOGEHGHEOGHEO"
        authenticate!
        userId = @current_user.user_id
        params[:room_ids].each do |roomId|
          userRoomsByUserId = UserRoom.where(user_id: userId, room_id: roomId)
          unless userRoomsByUserId.length == 0
            userRoomsByUserId.each do |userRoomByUserId|
              userRoomByUserId.delete
            end

            userRooms = UserRoom.where(room_id: roomId)
            if userRooms.length == 0
              ActionCable.server.broadcast 'room_add',
                room_id: room.room_id

              Room.find_by(room_id: roomId).delete
            end
          else
            return throw_error!("can't find rooms'", 400, 400)
          end

        end
        # TODO return something
      end

      # TODO use resource to declare directory
      desc 'Return messages per room'
      params do
        requires :access_token, type: String, desc: "access token"
      end
      get '/:room_id/messages' do
        authenticate!
        roomId = params[:room_id]
        # TODO refactor!! remove room_id
        messages = Message.where(room_id: roomId)
        users = UserRoom.where(room_id: roomId)
        usersInRoom = []
        users.each do |user|
          usersInRoom.push(user.user_id)
        end
        return {
          users: usersInRoom,
          messages: messages
        }
      end

      desc 'Add a message.'
      params do
        requires :access_token, type: String, desc: "access token"
        requires :message, type: String, desc: 'message'
      end
      post '/:room_id/messages/add' do
        authenticate!
        userId = @current_user.user_id
        message = Message.create(message: params[:message], user_id: userId, room_id: params[:room_id])

        ActionCable.server.broadcast 'messages',
          user_id: userId,
          message: params[:message],
          room_id: params[:room_id]

        message
      end

      desc 'Delete messages.'
      params do
        requires :access_token, type: String, desc: "access token"
        requires :message_ids, type: Array, desc: 'message ids'
      end
      post '/:room_id/messages/delete' do
        authenticate!
        roomId = params[:room_id]
        params[:message_ids].each do |messageId|
          messages = Message.where(message_id: messageId, room_id: roomId)
          messages.each do |message|
            message.delete
          end
        end
      end
    end
  end
end