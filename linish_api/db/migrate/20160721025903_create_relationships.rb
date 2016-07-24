class CreateRelationships < ActiveRecord::Migration[5.0]
  def change
    create_table :relationships, { id: false, primary_key: :id } do |t|
      t.column :id, 'BIGINT PRIMARY KEY AUTO_INCREMENT'
      t.string :follower_id, limit: 25, null: false
      t.string :followed_id, limit: 25, null: false

      t.timestamps null: false
    end
    add_index :relationships, :follower_id
    add_index :relationships, :followed_id
    add_index :relationships, [:follower_id, :followed_id], unique: true
  end
end
