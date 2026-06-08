from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from storages.backends.s3 import S3Storage


class ProxyS3Storage(S3Storage):
    """Private S3/B2 bucket: files stay in cloud, URLs go through Django (/media/...)."""

    def url(self, name, parameters=None, expire=None, http_method=None):
        media_url = settings.MEDIA_URL
        if not media_url.endswith("/"):
            media_url = f"{media_url}/"
        return f"{media_url}{name}"


def check_storage_connection() -> str:
    test_path = "_healthcheck/upload-test.txt"
    default_storage.save(test_path, ContentFile(b"ok"))
    if not default_storage.exists(test_path):
        raise RuntimeError("Файл загружен, но не найден в хранилище.")
    default_storage.delete(test_path)
    return "OK"
