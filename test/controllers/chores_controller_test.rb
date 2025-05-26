require "test_helper"

class ChoresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get chores_index_url
    assert_response :success
  end

  test "should get show" do
    get chores_show_url
    assert_response :success
  end

  test "should get new" do
    get chores_new_url
    assert_response :success
  end

  test "should get edit" do
    get chores_edit_url
    assert_response :success
  end
end
