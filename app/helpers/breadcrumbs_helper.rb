module BreadcrumbsHelper
  def breadcrumbs
    @breadcrumbs ||= []
  end

  def add_breadcrumb(title, path = nil)
    breadcrumbs << { title: title, path: path }
  end

  def render_breadcrumbs
    render partial: 'shared/breadcrumbs', locals: { breadcrumbs: breadcrumbs }
  end
end 