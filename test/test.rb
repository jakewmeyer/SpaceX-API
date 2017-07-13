require "test/unit"
require "rack/test"
require_relative '../app'
require 'json'

module Rack
  module Test
    DEFAULT_HOST = "api.example.org"
  end
end

class AppTest < Test::Unit::TestCase
  include Rack::Test::Methods

  def app
    @app = SpacexAPI
  end

  def test_response_is_ok
    get "/"
    assert last_response.ok?
  end
  
  def test_info_response
    get "/info"
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    #test out some data that is unlikely to ever change
    assert data["name"] == "SpaceX"
  end
  
  def test_vehicles_response
    get "/vehicles"
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    #make sure at least 1 vehicle is returned
    assert data.count > 0
  end
  
  def test_vehicles_falcon9_response
    get "/vehicles/falcon9"
    assert last_response.ok?
  end
  
  def test_vehicles_falconheavy_response
    get "/vehicles/falconheavy"
    assert last_response.ok?
  end
  
  def test_vehicles_dragon_response
    get "/vehicles/dragon"
    assert last_response.ok?
  end
  def test_launchpads_response
    get "/launchpads"
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    #make sure we got at least one launchpad back
    assert data["launchpads"].count > 0
  end	
  
  def test_launches_response
    get "/launches"
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    #make sure at least 1 launch is returned
    assert data.count > 0
  end
  def test_launches_year_response
    get "/launches/year=2010"
    assert last_response.ok?
    data = JSON.parse(last_response.body)
    #only 2 launches should be returned for 2010... unless launches somehow go back in time
    assert data.count == 2
  end
end
