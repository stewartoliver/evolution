module Operator
  class CategoriesController < ApplicationController
    before_action :authenticate_user!
    before_action :check_operator
    before_action :set_category, only: [:show, :edit, :update]

    def index
      @categories = Category.all
    end

    def new
      @category = Category.new
    end

    def create
      @category = Category.new(category_params)
      if @category.save!
        redirect_to @category
      else
        redirect_to :new
      end
    end

    def edit

    end

    def update
      if @category.update(category_params)
        redirect_to operator_category_path(@category)
      else
        redirect_to :new
      end
    end

    def show

    end

    private

    def check_operator
      redirect_to root_path, alert: 'You are not authorized to access this page.' unless current_user.operator?
    end

    def set_category
      @category = Category.find(params[:id])
    end

    def category_params
      params.require(:category).permit(:name, :category_type, :keywords)
    end
  end
end
