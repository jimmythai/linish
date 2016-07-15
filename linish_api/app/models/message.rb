class Message < ApplicationRecord
  belongs_to :room, class_name: "Room", foreign_key: "room_id"
  belongs_to :user, class_name: "User", foreign_key: "user_id"

  validates :message, presence: true, length: { maximum: 10000 }
  validates :room_id, presence: true
  validates :user_id, presence: true
end
