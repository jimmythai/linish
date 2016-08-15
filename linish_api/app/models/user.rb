class User < ApplicationRecord
  has_many :messages, class_name: "Message", dependent: :destroy
  has_many :user_rooms, class_name: "UserRoom", dependent: :destroy
  # has_many :user_rooms, class_name: "UserRoom"
  has_many :rooms, through: :user_rooms
  has_many :relationships, class_name: "Relationship", dependent: :destroy, foreign_key: [:followed_id, :follower_id]
  has_one :api_key, dependent: :destroy

  # has_many :active_relationships, class_name: "Relationship", foreign_key: "follower_id", dependent: :destroy
  # has_many :passive_relationships, class_name: "Relationship", foreign_key: "followed_id", dependent: :destroy
  # has_many :following, through: :active_relationships, source: :followed
  # has_many :followers, through: :passive_relationships, source: :follower

  before_save { user_id.downcase }
  validates :user_id, presence: true, length: { maximum: 25 }, uniqueness: true
  before_save { email.downcase! }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 8, maximum: 100 }

  # TODO avatar_image!!
  # TODO version_numbe!!
  # TODO device_token!!
end