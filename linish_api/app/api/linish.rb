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

      def check_session
        return throw_error!('Bad request', 400, 400) if env['rack.session'][:user_id].nil?
      end

      def login(user_id)
        env['rack.session'][:user_id] = user_id
      end

      def logout
        env['rack.session'][:user_id].clear
      end
    end

    resource :accounts do
      desc 'Return users.'
      get do
        check_session
        if params[:uuid]
          user = User.find_by(uuid: params[:uuid])
          if user.nil?
            throw_error!("User doesn't exist.", 400, 400) if user.nil?
          else
           return user
          end
        else
          User.all.limit(20)
        end
      end

      # route_paramを使うとname spaceのように区切れる
      route_param :user_id do
        desc 'Return a specific user.'
        get do
          check_session
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
      #     check_session
      #     user = User.find_by(uuid: params[:uuid])
      #     throw_error!("User doesn't exist.", 400, 400) if user.nil?
      #   end
      # end

      desc 'Signin to an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :password, type: String, desc: 'user password'
        optional :uuid, type: String, desc: 'uuid'
      end
      post :signin do
        p params[:password]
        user = User.find_by(user_id: params[:user_id])
        doesUserExist = !user.nil?
        isAuthenticated = doesUserExist && user.authenticate(params[:password])
        error = {}
        unless doesUserExist
          error[:user_id] = ["isn't correct"]
          throw_error!(error, 400, 400)
        end

        if isAuthenticated
          uuid = params[:uuid]
          unless uuid.nil?
            user.update_attribute(:uuid, uuid)
          end
          login(user.user_id)
          return user
        else
          error[:password] = ["isn't correct"]
          throw_error!(error, 400, 400)
        end
      end

      desc 'Signout an account.'
      params do
      end
      post :signout do
        user = User.find_by(user_id: env['rack.session'][:user_id])
        user.update_attribute(:uuid, nil)
        logout
      end

      desc 'Create an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :email, type: String, desc: 'user email'
        requires :password, type: String, desc: 'user password'
        optional :uuid, type: String, desc: 'uuid'
      end
      post :signup do
        user = User.new(user_id: params[:user_id], email: params[:email], password: params[:password], device_token: params[:device_token])
        if user.valid?
          uuid = params[:uuid]
          unless uuid.nil?
            user.uuid = uuid
          end
          user.save
          login(user.user_id)
        else
          throw_error!(user.errors, 400, 400)
        end
      end

      desc 'Delete an account.'
      params do
        optional :user_id, type: String, desc: 'user id'
        # requires :password, type: String, desc: 'user password'
      end
      post :delete do
        check_session
        userId = params[:user_id] || env['rack.session'][:user_id]
        User.find_by(user_id: userId).destroy
        # TODO return something
      end
    end

    resource :friends do
      desc 'Get friends.'
      get do
        check_session
        userId = params[:user_id] || env['rack.session'][:user_id]
        if userId.nil?
          Relationship.all.limit(20)
        else
          followedUsers = []
          followers = Relationship.where(follower_id: userId)
          followers.each do |follower|
            followedUsers.push(follower.followed_id)
          end
          followingUsers = []
          followings = Relationship.where(followed_id: userId)
          followings.each do |following|
            followingUsers.push(following.follower_id)
          end
          friends = followedUsers.concat(followingUsers)
          friends.sort
        end
      end

      desc 'Add friends.'
      params do
        requires :followed_id, type: String, desc: 'followed id'
        optional :follower_id, type: String, desc: 'follower id'
      end
      post :add do
        check_session
        followerId = params[:follower_id] || env['rack.session'][:user_id]
        followedId = params[:followed_id]
        throw_error!("You can't be a friend with yourself", 400, 400) if followerId == followedId
        relationship = Relationship.create(follower_id: followerId, followed_id: followedId)
        errorMessages = relationship.errors.full_messages
        errorMessages = "Already your friend" if errorMessages.instance_of?(Array) && !errorMessages.empty?
        throw_error!(errorMessages, 400, 400) unless errorMessages.empty?
      end

      desc 'Delete friends.'
      params do
        optional :user_id, type: String, desc: 'user id'
        requires :user_ids, type: Array, desc: 'user ids'
      end
      post :delete do
        check_session
        userIds = params[:user_ids]
        userId = params[:user_id] || env['rack.session'][:user_id]
        userIds.push(userId)
        userIds.each do |userId|
          user = Relationship.find_by(follower_id: userId)
          if user.nil?
            user = Relationship.find_by(followed_id: userId)
          end
          if user.nil?
            throw_error!("can't find friends'", 400, 400)
          else
            user.destroy
          end
        end
      end
    end

    resource :rooms do
      desc 'Return rooms.'
      get do
        check_session
        userId = params[:user_id] || env['rack.session'][:user_id]
        if userId.nil?
          UserRoom.all.limit(20)
        else
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
          rooms.sort_by { |room| room[:updated_at] }
        end
      end

      # TODO dont let it make a room which exists if it has only one memberId
      desc 'Create a room.'
      params do
        optional :creater_id, type: String, desc: 'user id'
        requires :member_ids, type: Array, desc: 'user ids'
      end
      post :create do
        check_session
        createrId = params[:creater_id] || env['rack.session'][:user_id]
        memberIds = params[:member_ids]
        throw_error!("can't find user'", 400, 400) if memberIds.empty?
        memberIds.push(createrId)
        room = Room.create
        memberIds.each do |memberId|
          user = User.find_by(user_id: memberId)
          if user.nil?
            room.destroy
            throw_error!("can't find user'", 400, 400)
          else
            user.user_rooms.create(room_id: room.room_id)
          end
        end
      end

      desc 'delete a room.'
      params do
        optional :user_id, type: String, desc: 'user id'
        requires :room_ids, type: Array, desc: 'room ids'
      end
      post :delete do
        check_session
        userId = params[:user_id] || env['rack.session'][:user_id]
        params[:room_ids].each do |roomId|
          userRoomsByUserId = UserRoom.where(user_id: userId, room_id: roomId)
          unless userRoomsByUserId.length == 0
            userRoomsByUserId.each do |userRoomByUserId|
              userRoomByUserId.delete
            end

            userRooms = UserRoom.where(room_id: roomId)
            if userRooms.length == 0
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
      get '/:room_id/messages' do
        check_session
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
        optional :user_id, type: String, desc: 'user id'
        requires :message, type: String, desc: 'message'
      end
      post '/:room_id/messages/add' do
        check_session
        userId = params[:user_id] || env['rack.session'][:user_id]
        message = Message.create(message: params[:message], user_id: userId, room_id: params[:room_id])
      end

      desc 'Delete messages.'
      params do
        requires :message_ids, type: Array, desc: 'message ids'
      end
      post '/:room_id/messages/delete' do
        check_session
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