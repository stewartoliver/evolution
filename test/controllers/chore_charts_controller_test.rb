require "test_helper"

class ChoreChartsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get chore_charts_index_url
    assert_response :success
  end

  test "should get show" do
    get chore_charts_show_url
    assert_response :success
  end

  test "should get new" do
    get chore_charts_new_url
    assert_response :success
  end

  test "should get edit" do
    get chore_charts_edit_url
    assert_response :success
  end
end
