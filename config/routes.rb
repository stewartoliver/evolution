Rails.application.routes.draw do
  get 'chore_charts/index'
  get 'chore_charts/show'
  get 'chore_charts/new'
  get 'chore_charts/edit'
  get 'chores/index'
  get 'chores/show'
  get 'chores/new'
  get 'chores/edit'
  devise_for :users, path: '', path_names: { sign_in: 'sign-in', sign_out: 'sign-out', sign_up: 'sign-up' }, controllers: { registrations: 'users/registrations', sessions: 'users/sessions' }
  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root "pages#index"
  get 'how-it-works', to: 'pages#how_it_works'
  get 'about-us', to: 'pages#about_us'
  get 'features', to: 'pages#features'

  resources :users, only: [] do
    resources :user_weight_histories, only: [:index, :new, :create, :edit, :update, :destroy]
  end

  devise_scope :user do
    get 'profile', to: 'users/registrations#show', as: :user_profile
    get 'profile/edit', to: 'users/registrations#edit', as: :edit_user_profile
  end

  namespace :operator do
    get 'dashboard', to: 'dashboard#index'
    resources :categories, path: 'categories'

    namespace :fitness do
      resources :muscle_groups, path: 'muscle-groups'
      resources :exercise_types, path: 'exercise-types' do
        member do
          post :merge
        end
      end
      resources :exercises
    end
  end

  namespace :finances do
    get 'dashboard', to: 'dashboard#index'
    resources :accounts
    resources :transactions do
      collection do
        post :import
        post :recategorize_all
      end
      member do
        post :create_expense_from_similar
      end
    end    
    resources :incomes
    resources :expenses do
      member do
        post :mark_as_paid
        delete :unmark_as_paid
      end
    end
    resources :budgets
  end

  namespace :fitness do
    get 'dashboard', to: 'dashboard#index'
    resources :exercises
    resources :routines do
      member do
        post 'use_routine_and_create_log'
      end
    end
    resources :logs

  end

  namespace :health do
    get 'dashboard', to: 'dashboard#index'
    resources :diets
  end

  namespace :objectives do
    get 'dashboard', to: 'dashboard#index'
    resources :habits do
      member do
        post :complete
        get :details
        get :today_occurrences
      end
      resources :habit_logs, only: [:create]
    end
    resources :goals do
      resources :fitness_goals, only: [:create, :update, :destroy]
      member do
        post 'make_task'
        patch 'complete'
        get 'new_child', to: 'goals#new_child'
        post 'create_child', to: 'goals#create_child'
        post 'toggle_favourite'
        get 'remaining_tasks'
      end
    end
    resources :finance_goals
    resources :diet_goals
    get 'tasks/filter_by_goal', to: 'tasks#filter_by_goal', as: 'filter_by_goal_tasks'
    resources :tasks do
      member do
        post :reorder
      end
      resources :checklists do
        resources :checklist_items do
          member do
            post :reorder
          end
        end
      end
    end
    resources :achievements
    resources :chores do
      member do
        post :complete
      end
    end
    resources :chore_charts
    resources :chore_logs, only: [:create]
  end

  namespace :api do
    namespace :v1 do
      get 'tasks_completed_per_day', to: 'tasks#completed_per_day'
    end
  end

end