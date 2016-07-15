class Room < ApplicationRecord
  has_many :messages, class_name: "Message"
  has_many :user_rooms, class_name: "UserRoom"
  has_many :users, through: :user_rooms
end