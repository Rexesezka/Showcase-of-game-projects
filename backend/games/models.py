from django.db import models
import os
import uuid


class Game(models.Model):
    """Модель для хранения информации об игре"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name='Название игры')
    description = models.TextField(blank=True, verbose_name='Описание')
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')
    build_path = models.CharField(max_length=500, verbose_name='Путь к билду')
    is_active = models.BooleanField(default=True, verbose_name='Активна')
    
    class Meta:
        verbose_name = 'Игра'
        verbose_name_plural = 'Игры'
        ordering = ['-upload_date']
    
    def __str__(self):
        return self.name
    
    def get_game_url(self):
        """Возвращает URL для запуска игры"""
        return f'/media/games/{self.id}/index.html'
