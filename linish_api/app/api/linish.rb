module Linish
  class API < Grape::API
    version 'v1', using: :path
    format :json
    prefix :api

    resource :accounts do
      desc 'Return users.'
      get do
        User.all.limit(20)
      end

      # route_paramを使うとname spaceのように区切れる
      route_param :user_id do
        desc 'Return a specific user.'
        get do
          User.find_by(user_id: params[:user_id])
        end
      end

      desc 'Signin to an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :password, type: String, desc: 'user password'
      end
      post :signin do
        # TODO return something
      end

      desc 'Create an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :email, type: String, desc: 'user email'
        requires :password, type: String, desc: 'user password'
      end
      post :signup do
        User.create(user_id: params[:user_id], email: params[:email], password: params[:password], device_token: params[:device_token])
        # TODO return something
      end

      desc 'Delete an account.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :password, type: String, desc: 'user password'
      end
      post :delete do
        User.find_by(user_id: params[:user_id]).delete
        # TODO return something
      end
    end

    resource :rooms do
      desc 'Return rooms.'
      get do
        userId = params[:user_id]
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
          # sortedRooms = rooms.sort_by { |room| room[:updated_at] }
          # return sortedRoom
        end
      end

      desc 'Create a room.'
      params do
        requires :user_ids, type: Array, desc: 'user ids'
      end
      post :create do
        room = Room.create
        params[:user_ids].each do |userId|
          user = User.find_by(user_id: userId)
          user.user_rooms.create(room_id: room.room_id)
          # TODO return something
        end
      end

      desc 'delete a room.'
      params do
        requires :user_id, type: String, desc: 'user id'
        requires :room_ids, type: Array, desc: 'room ids'
      end
      post :delete do
        userId = params[:user_id]
        params[:room_ids].each do |roomId|
          userRoomsByUserId = UserRoom.where(user_id: userId, room_id: roomId)
          userRoomsByUserId.each do |userRoomByUserId|
            userRoomByUserId.delete
          end
          userRooms = UserRoom.where(room_id: roomId)
          if userRooms.length === 0
            Room.find_by(room_id: roomId).delete
          end
        end
        # TODO return something
      end

      # TODO use resource to declare directory
      desc 'Return messages per room'
      get '/:room_id/messages' do
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
        message = Message.create(message: params[:message], user_id: params[:user_id], room_id: params[:room_id])
      end

      desc 'Delete messages.'
      params do
        requires :message_ids, type: Array, desc: 'message ids'
      end
      post '/:room_id/messages/delete' do
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