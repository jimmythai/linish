class CreateUserRooms < ActiveRecord::Migration[5.0]
  def change
    create_table :user_rooms, { id: false, primary_key: :id } do |t|
      t.column :id, 'BIGINT PRIMARY KEY AUTO_INCREMENT'
      t.string :user_id, limit: 25, null: false
      t.integer :room_id, limit: 5, null: false

      t.timestamps
    end
    add_index :user_rooms, :user_id
    add_index :user_rooms, :room_id
    add_index :user_rooms, [:user_id, :room_id], unique: true

    add_foreign_key :user_rooms, :users, column: :user_id, primary_key: "user_id"
    add_foreign_key :user_rooms, :rooms, column: :room_id, primary_key: "room_id"
  end
end
