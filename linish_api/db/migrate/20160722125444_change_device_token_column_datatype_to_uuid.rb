class ChangeDeviceTokenColumnDatatypeToUuid < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :device_token, :string
    rename_column :users, :device_token, :uuid
  end
end
