class UpdateForeignKeyOfUserRooms < ActiveRecord::Migration[5.0]
  def change
    # remove_foreign_key :user_rooms, :users
    add_foreign_key :user_rooms, :users, column: :user_id, primary_key: "user_id", options: 'ON UPDATE CASCADE ON DELETE CASCADE'
  end
end
