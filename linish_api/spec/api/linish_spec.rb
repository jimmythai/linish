require 'rails_helper'

describe Linish::API do
  context "GET /api/v1/accounts/public" do
    it "return empty array" do
      get '/api/v1/accounts/public'
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to eq []
    end

    it "return a article" do
      User.create(id: "ayamam1127", email: "ayamam1127@gmail.com", password: "jimmy0729")
      get '/api/v1/articles/public'
      expect(response.status).to eq(200)
      expect(response.body).to eq User.limit(20).to_json
    end
  end

  # context "POST /api/v1/accounts/" do
  #   it "authorized 401" do
  #     post '/api/v1/articles/', params: { title: "title", author_id: 1 }
  #     expect(response.status).to eq(401)
  #   end

  #   it 'create article' do
  #     User.create(name: "tarou", )
  #     post '/api/v1/accounts/', params: { title: "title", author_id: 1 }, headers: { 'X-Access-Token' => 'test' }
  #     expect(response.status).to eq(201)
  #     expect(Article.first).not_to eq nil
  #   end
  # end
end
