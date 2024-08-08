Rails.application.routes.draw do
  devise_for :users, path: '', path_names: { sign_in: 'sign-in', sign_out: 'sign-out', sign_up: 'sign-up' }, controllers: { registrations: 'users/registrations', sessions: 'users/sessions' }
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

  namespace :operator do
    get 'dashboard', to: 'dashboard#index'

    namespace :fitness do
      resources :muscle_groups, path: 'muscle-groups'
      resources :exercise_types, path: 'exercise-types'
      resources :exercises
    end
  end

  namespace :finances do
    get 'dashboard', to: 'dashboard#index'
    resources :accounts
    resources :transactions
    resources :incomes
    resources :expenses
    resources :budgets
  end

  namespace :fitness do
    get 'dashboard', to: 'dashboard#index'
    resources :exercises
    resources :routines
    resources :logs
  end

  namespace :objectives do
    get 'dashboard', to: 'dashboard#index'
    resources :goals do
      member do
        post 'make_task'
        patch 'complete'
        get 'new_child', to: 'goals#new_child'
        post 'create_child', to: 'goals#create_child'
        post 'toggle_favourite'
        get 'remaining_tasks'
      end
    end
    get 'tasks/filter_by_goal', to: 'tasks#filter_by_goal', as: 'filter_by_goal_tasks'
    resources :tasks
    resources :achievements
  end

  namespace :api do
    namespace :v1 do
      get 'tasks_completed_per_day', to: 'tasks#completed_per_day'
    end
  end

end