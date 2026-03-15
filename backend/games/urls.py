from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_game, name='upload_game'),
    path('play/<uuid:game_id>/', views.play_game, name='play_game'),
]
