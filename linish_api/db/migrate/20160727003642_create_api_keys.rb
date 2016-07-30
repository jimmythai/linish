class CreateApiKeys < ActiveRecord::Migration[5.0]
  def change
    create_table :api_keys, { id: false, primary_key: :user_id } do |t|
      t.string :user_id, limit: 25, primary_key: true
      t.string :access_token, null: false


      t.timestamps
    end
    add_index :api_keys, ["user_id"], name: "index_api_keys_on_user_id", unique: true
    add_index :api_keys, ["access_token"], name: "index_api_keys_on_access_token", unique: true
  end
end