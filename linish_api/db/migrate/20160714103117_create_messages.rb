class CreateMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :messages, { id: false, primary_key: :message_id } do |t|
      # TODO refactor!!
      t.column :message_id, 'BIGINT PRIMARY KEY AUTO_INCREMENT'
      t.text :message, null: false
      t.integer :room_id, limit: 5, null: false
      t.string :user_id, limit: 25, null: false

      t.timestamps
    end
    add_index :messages, :user_id
    add_index :messages, :room_id

    add_foreign_key :messages, :users, column: :user_id, primary_key: "user_id"
    add_foreign_key :messages, :rooms, column: :room_id, primary_key: "room_id"
  end
end
