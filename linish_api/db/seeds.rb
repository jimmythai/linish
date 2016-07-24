# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

10.times do |n|
  user_id  = "ayamam11#{n+1}"
  email = "ayamam11#{n+1}@gmail.com"
  password = "jimmy0729"
  User.create!(user_id: user_id,
              email: email,
              password: password)
end

users = User.all
user  = users.first
# following = users[1..5]
# followers = users[1..5]
following.each { |followed| user.follow(followed) }
followers.each { |follower| follower.follow(user) }