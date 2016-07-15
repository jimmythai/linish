class CreateRooms < ActiveRecord::Migration[5.0]
  def change
    create_table :rooms, { id: false, primary_key: :room_id} do |t|
      # TODO refactor!!
      t.column :room_id, 'BIGINT PRIMARY KEY AUTO_INCREMENT'

      t.timestamps
    end
  end
end

# Command
# rake db:drop db:create db:migrate