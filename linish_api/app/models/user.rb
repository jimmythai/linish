class User < ApplicationRecord
  has_many :messages, class_name: "Message"
  has_many :user_rooms, class_name: "UserRoom"
  has_many :rooms, through: :user_rooms

  before_save { user_id.downcase }
  validates :user_id, presence: true, length: { maximum: 25 }, uniqueness: true
  before_save { email.downcase }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 }, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 8, maximum: 100 }

  # TODO avatar_image!!
  # TODO version_numbe!!
  # TODO device_token!!
end