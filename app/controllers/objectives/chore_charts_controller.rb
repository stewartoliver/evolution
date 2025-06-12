module Objectives
  class ChoreChartsController < ApplicationController
    before_action :set_chore_chart, only: [:show, :edit, :update, :destroy, :chores, :add_chore, :remove_chore, :reorder, :complete_chore, :add_user, :remove_user, :update_user_position, :assign_user, :update_chore_position]

    def index
      @chore_charts = current_user.chore_charts.order(created_at: :desc)
    end

    def show
      @chores = @chore_chart.chores.includes(:chore_logs)
      
      respond_to do |format|
        format.html
        format.json do
          # Get or create current rotation
          current_rotation = @chore_chart.chore_rotations.current.first
          if current_rotation.nil?
            current_rotation = @chore_chart.chore_rotations.create!(
              rotation_number: @chore_chart.current_rotation,
              start_date: Time.current,
              end_date: Time.current + 1.week,
              completed: false
            )
          end

          # Get rotation users ordered by position
          rotation_users = current_rotation.chore_rotation_users.order(:position)
          
          # If no users exist, add the creator
          if rotation_users.empty? && @chore_chart.user
            rotation_users = [current_rotation.chore_rotation_users.create!(
              name: @chore_chart.user.name,
              email: @chore_chart.user.email,
              user_id: @chore_chart.user.id,
              position: 1
            )]
          end

          # Get chore assignments for current rotation
          rotation_assignments = current_rotation.chore_rotation_users.includes(:chore).where.not(chore_id: nil)

          render json: {
            chores: @chores.map { |chore| 
              # Find the assigned user for this chore in the current rotation
              assigned_user = rotation_assignments.find { |u| u.chore_id == chore.id }
              
              {
                id: chore.id,
                name: chore.name,
                description: chore.description,
                category: chore.category,
                estimated_minutes: chore.estimated_minutes,
                position: chore.position,
                in_current_rotation: chore.in_current_rotation,
                rotation_completed: chore.rotation_completed,
                assigned_user_id: assigned_user&.id
              }
            },
            rotation_status: {
              current_rotation: @chore_chart.current_rotation,
              next_rotation_date: @chore_chart.next_rotation_date
            },
            users: rotation_users.map { |user| 
              {
                id: user.id,
                name: user.name,
                email: user.email,
                position: user.position,
                user_id: user.user_id
              }
            }
          }
        end
      end
    end

    def new
      @chore_chart = current_user.chore_charts.build
    end

    def edit
    end

    def create
      @chore_chart = current_user.chore_charts.build(chore_chart_params)

      if @chore_chart.save
        redirect_to objectives_chore_chart_path(@chore_chart), notice: 'Chore chart was successfully created.'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def update
      if @chore_chart.update(chore_chart_params)
        redirect_to objectives_chore_chart_path(@chore_chart), notice: 'Chore chart was successfully updated.'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @chore_chart.destroy
      redirect_to objectives_chore_charts_path, notice: 'Chore chart was successfully deleted.'
    end

    # API endpoints for React component
    def chores
      @chores = @chore_chart.chores.includes(:chore_logs).order(:position)
      current_rotation_chores = @chore_chart.current_rotation_chores
      
      # Get completion status for current rotation
      current_rotation = @chore_chart.current_rotation
      rotation_completions = ChoreRotation.where(
        chore_chart: @chore_chart,
        rotation_number: current_rotation
      ).pluck(:chore_id, :completed).to_h
      
      respond_to do |format|
        format.json { 
          render json: {
            chores: @chores.map { |chore| 
              chore.as_json(
                methods: [:completed],
                include: { chore_logs: { only: [:completed_at] } }
              ).merge(
                in_current_rotation: current_rotation_chores.include?(chore),
                rotation_completed: rotation_completions[chore.id] || false
              )
            },
            rotation_status: {
              current_rotation: @chore_chart.current_rotation,
              next_rotation_date: @chore_chart.next_rotation_date&.strftime("%B %d, %Y"),
              rotation_frequency: @chore_chart.rotation_frequency,
              rotation_day: @chore_chart.rotation_day
            }
          }
        }
      end
    end

    def add_chore
      respond_to do |format|
        format.json do
          if @chore_chart.add_chore(params[:chore_id])
            render json: { success: true, message: 'Chore added successfully' }
          else
            render json: { success: false, error: 'Could not add chore to chart' }, status: :unprocessable_entity
          end
        end
      end
    end

    def remove_chore
      if @chore_chart.remove_chore(params[:chore_id])
        render json: { success: true }
      else
        render json: { success: false, error: 'Could not remove chore from chart' }, status: :unprocessable_entity
      end
    end

    def reorder
      return render json: { success: false, error: 'No chore IDs provided' }, status: :unprocessable_entity unless params[:chore_ids].present?

      ActiveRecord::Base.transaction do
        params[:chore_ids].each_with_index do |chore_id, index|
          chore = @chore_chart.chores.find_by(id: chore_id)
          next unless chore
          chore.update!(position: index + 1)
        end
      end

      render json: { success: true }
    rescue ActiveRecord::RecordInvalid => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end

    def complete_chore
      chore = @chore_chart.chores.find(params[:chore_id])
      return render json: { success: false, error: 'Chore not found' }, status: :not_found unless chore

      # Create a chore rotation record if it doesn't exist
      rotation = ChoreRotation.find_or_initialize_by(
        chore_chart: @chore_chart,
        chore: chore,
        rotation_number: @chore_chart.current_rotation
      )

      # Set the date range for this rotation
      if rotation.new_record?
        case @chore_chart.rotation_frequency
        when 'daily'
          rotation.start_date = Date.current
          rotation.end_date = Date.current
        when 'weekly'
          rotation.start_date = Date.current.beginning_of_week
          rotation.end_date = Date.current.end_of_week
        when 'biweekly'
          rotation.start_date = Date.current.beginning_of_week
          rotation.end_date = (Date.current + 1.week).end_of_week
        when 'monthly'
          rotation.start_date = Date.current.beginning_of_month
          rotation.end_date = Date.current.end_of_month
        end
      end

      rotation.completed = !rotation.completed
      
      if rotation.save
        render json: { 
          success: true, 
          message: rotation.completed ? 'Chore marked as complete' : 'Chore marked as incomplete',
          completed: rotation.completed
        }
      else
        render json: { success: false, error: 'Could not update chore completion status' }, status: :unprocessable_entity
      end
    end

    def add_user
      # Check if user_id is provided and valid
      if params[:user_id].present?
        user = User.find_by(id: params[:user_id])
        return render json: { success: false, error: 'User not found' }, status: :not_found unless user
      end

      # Get or create current rotation
      current_rotation = @chore_chart.chore_rotations.current.first
      if current_rotation.nil?
        current_rotation = @chore_chart.chore_rotations.create!(
          rotation_number: @chore_chart.current_rotation,
          start_date: Time.current,
          end_date: Time.current + 1.week,
          completed: false
        )
      end

      # Create chore rotation user with next position
      next_position = current_rotation.chore_rotation_users.maximum(:position).to_i + 1
      user = current_rotation.chore_rotation_users.create!(
        name: params[:name],
        email: params[:email],
        user_id: params[:user_id],
        position: next_position
      )

      render json: {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        user_id: user.user_id
      }
    rescue ActiveRecord::RecordInvalid => e
      render json: { success: false, error: e.message }, status: :unprocessable_entity
    end

    def remove_user
      user = @chore_chart.chore_rotations.current.first&.chore_rotation_users&.find_by(id: params[:user_id])
      
      if user
        user.destroy
        render json: { success: true }
      else
        render json: { success: false, error: 'User not found' }, status: :not_found
      end
    end

    def update_user_position
      current_rotation = @chore_chart.chore_rotations.current.first
      return render json: { success: false, error: 'No active rotation found' }, status: :unprocessable_entity unless current_rotation

      user = current_rotation.chore_rotation_users.find_by(id: params[:user_id])
      return render json: { success: false, error: 'User not found' }, status: :not_found unless user

      # Get all users in current rotation ordered by position
      users = current_rotation.chore_rotation_users.order(:position).to_a
      old_index = users.find_index { |u| u.id == user.id }
      new_index = params[:position].to_i - 1

      # Remove user from array and insert at new position
      users.delete_at(old_index)
      users.insert(new_index, user)

      # Update positions for all users
      users.each_with_index do |u, index|
        u.update!(position: index + 1)
      end

      render json: { success: true }
    end

    def assign_user
      Rails.logger.info "Assign user params: #{params.inspect}"
      
      chore = @chore_chart.chores.find(params[:chore_id])
      return render json: { success: false, error: 'Chore not found' }, status: :not_found unless chore

      # Get current rotation
      current_rotation = @chore_chart.chore_rotations.current.first
      if current_rotation.nil?
        current_rotation = @chore_chart.chore_rotations.create!(
          rotation_number: @chore_chart.current_rotation,
          start_date: Time.current,
          end_date: Time.current + 1.week,
          completed: false
        )
      end

      # Find the user in the current rotation
      user = current_rotation.chore_rotation_users.find_by(id: params[:user_id])
      Rails.logger.info "Found user: #{user.inspect}"
      return render json: { success: false, error: 'User not found in current rotation' }, status: :not_found unless user

      # Update or create the chore assignment
      if user.update(chore_id: chore.id)
        render json: { 
          success: true,
          assigned_user: {
            id: user.id,
            name: user.name,
            email: user.email,
            position: user.position,
            user_id: user.user_id
          }
        }
      else
        Rails.logger.error "User update failed: #{user.errors.full_messages.join(', ')}"
        render json: { 
          success: false, 
          error: user.errors.full_messages.join(', ')
        }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordInvalid => e
      Rails.logger.error "Record invalid: #{e.message}"
      render json: { 
        success: false, 
        error: e.record.errors.full_messages.join(', ')
      }, status: :unprocessable_entity
    end

    def update_chore_position
      chore = @chore_chart.chores.find(params[:chore_id])
      return render json: { success: false, error: 'Chore not found' }, status: :not_found unless chore

      if chore.update(position: params[:position])
        render json: { success: true }
      else
        render json: { success: false, error: 'Could not update chore position' }, status: :unprocessable_entity
      end
    end

    private

    def set_chore_chart
      @chore_chart = ChoreChart.find(params[:id])
    end

    def chore_chart_params
      params.require(:chore_chart).permit(:name, :description, :rotation_frequency, :start_date, :rotation_day)
    end
  end
end 