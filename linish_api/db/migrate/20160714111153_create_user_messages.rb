class CreateUserMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :user_messages do |t|
      t.string :user_id, limit: 25, null: false
      t.integer :message_id, limit: 5, null: false

      t.timestamps
    end
    add_index :user_messages, :user_id
    add_index :user_messages, :message_id
    add_index :user_messages, [:user_id, :message_id], unique: true
  end
end
