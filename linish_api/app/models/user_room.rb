class UserRoom < ApplicationRecord
  belongs_to :room, class_name: "Room", foreign_key: "room_id"
  belongs_to :user, class_name: "User", foreign_key: "user_id"

  validates :user_id, presence: true, uniqueness: { scope: :room_id }
  validates :room_id, presence: true, uniqueness: { scope: :user_id }
end
