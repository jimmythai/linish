Rails.application.routes.draw do
  mount Linish::API => '/'
  # For ActionCable
  mount ActionCable.server => '/cable'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
