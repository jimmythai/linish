class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users, { id: false, primary_key: :user_id } do |t|
      # TODO refactor!!
      t.string :user_id, limit: 25, primary_key: true
      t.string :email, null: false, unique: true
      t.string :password, limit: 100
      t.string :password_digest, null: false
      t.binary :avatar_image, limit: 200.kilobyte
      t.integer :version_number
      t.integer :device_token, unique: true

      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :device_token, unique: true
  end
end

# Command
# rake db:drop db:create db:migrate