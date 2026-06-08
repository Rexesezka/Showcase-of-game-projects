"""
URL configuration for game_showcase project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from games.media_views import serve_media

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('games.urls')),
]

if settings.DEBUG and not settings.USE_S3_MEDIA:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve_media),
    ]
