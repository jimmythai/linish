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
        User.all.limit(20)
      end

      # route_paramを使うとname spaceのように区切れる
      route_param :user_id do
        desc 'Return a specific user.'
        get do
          check_session
          User.find_by(user_id: params[:user_id])
        end
      end

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
        logout
      end

      desc 'Create an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :email, type: String, desc: 'user email'
        requires :password, type: String, desc: 'user password'
      end
      post :signup do
        user = User.new(user_id: params[:user_id], email: params[:email], password: params[:password], device_token: params[:device_token])
        if user.valid?
          user.save
          login(user.user_id)
        else
          throw_error!(user.errors, 400, 400)
        end
      end

      desc 'Delete an account.'
      params do
        # requires :user_id, type: String, desc: 'user id'
        # requires :password, type: String, desc: 'user password'
      end
      post :delete do
        check_session
        # User.find_by(user_id: params[:user_id]).delete
        User.find_by(user_id: env['rack.session'][:user_id]).destroy
        # TODO return something
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
            rooms.push({room_id: roomId, updated_at: updatedAt, user_ids: users})
          end
          rooms.sort_by { |room| room[:updated_at] }
        end
      end

      desc 'Create a room.'
      params do
        requires :user_ids, type: Array, desc: 'user ids'
      end
      post :create do
        check_session
        room = Room.create
        params[:user_ids].each do |userId|
          user = User.find_by(user_id: userId)
          user.user_rooms.create(room_id: room.room_id)
          # TODO return something
        end
      end

      desc 'delete a room.'
      params do
        # requires :user_id, type: String, desc: 'user id'
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
      end

      desc 'Add a message.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :message, type: String, desc: 'message'
      end
      post '/:room_id/messages/add' do
        check_session
        message = Message.create(message: params[:message], user_id: params[:user_id], room_id: params[:room_id])
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