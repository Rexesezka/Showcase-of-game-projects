from django.contrib import admin
from .models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['name', 'upload_date', 'is_active']
    list_filter = ['is_active', 'upload_date']
    search_fields = ['name', 'description']
