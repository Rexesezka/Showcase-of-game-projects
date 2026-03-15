from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, Http404
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import zipfile
import os
import uuid
import shutil
from .models import Game


def index(request):
    """Главная страница со списком игр"""
    games = Game.objects.filter(is_active=True)
    return render(request, 'games/index.html', {'games': games})


def play_game(request, game_id):
    """Страница для игры"""
    game = get_object_or_404(Game, id=game_id, is_active=True)
    return render(request, 'games/play.html', {'game': game})


@require_http_methods(["POST"])
def upload_game(request):
    """Обработка загрузки архива с игрой"""
    if 'game_archive' not in request.FILES:
        return JsonResponse({'error': 'Файл не найден'}, status=400)
    
    archive_file = request.FILES['game_archive']
    game_name = request.POST.get('game_name', archive_file.name.rsplit('.', 1)[0])
    
    # Проверяем что это zip архив
    if not archive_file.name.endswith('.zip'):
        return JsonResponse({'error': 'Поддерживаются только ZIP архивы'}, status=400)
    
    try:
        # Создаем уникальную папку для игры
        game_id = uuid.uuid4()
        game_dir = os.path.join(settings.MEDIA_ROOT, 'games', str(game_id))
        os.makedirs(game_dir, exist_ok=True)
        
        # Сохраняем архив временно
        temp_archive_path = os.path.join(game_dir, archive_file.name)
        with default_storage.open(temp_archive_path, 'wb+') as destination:
            for chunk in archive_file.chunks():
                destination.write(chunk)
        
        # Распаковываем архив
        with zipfile.ZipFile(temp_archive_path, 'r') as zip_ref:
            zip_ref.extractall(game_dir)
        
        # Удаляем временный архив
        os.remove(temp_archive_path)
        
        # Проверяем наличие index.html (стандартный файл Unity WebGL)
        index_path = os.path.join(game_dir, 'index.html')
        if not os.path.exists(index_path):
            # Ищем index.html в подпапках
            found_index = None
            for root, dirs, files in os.walk(game_dir):
                if 'index.html' in files:
                    found_index = root
                    break
            
            if found_index and found_index != game_dir:
                # Если нашли в подпапке, перемещаем содержимое на уровень выше
                for item in os.listdir(found_index):
                    src = os.path.join(found_index, item)
                    dst = os.path.join(game_dir, item)
                    if os.path.exists(dst):
                        if os.path.isdir(dst):
                            shutil.rmtree(dst)
                        else:
                            os.remove(dst)
                    if os.path.exists(src):
                        if os.path.isdir(src):
                            shutil.move(src, dst)
                        else:
                            os.rename(src, dst)
                # Удаляем пустую подпапку если она осталась
                try:
                    if os.path.exists(found_index) and not os.listdir(found_index):
                        os.rmdir(found_index)
                except:
                    pass
        
        # Создаем запись в базе данных
        game = Game.objects.create(
            id=game_id,
            name=game_name,
            description=request.POST.get('description', ''),
            build_path=f'games/{game_id}'
        )
        
        return JsonResponse({
            'success': True,
            'game_id': str(game_id),
            'message': 'Игра успешно загружена'
        })
        
    except zipfile.BadZipFile:
        return JsonResponse({'error': 'Некорректный ZIP архив'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Ошибка при обработке: {str(e)}'}, status=500)
