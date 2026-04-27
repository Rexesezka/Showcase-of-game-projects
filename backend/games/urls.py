from django.urls import path
from . import views

urlpatterns = [
    path("api/seasons/", views.seasons_list, name="seasons_list"),
    path("api/projects/", views.projects_list, name="projects_list"),
    path("api/projects/<int:project_id>/", views.project_detail, name="project_detail"),
    path("api/stats/", views.stats, name="stats"),
    path("api/applications/", views.create_application, name="create_application"),
]
