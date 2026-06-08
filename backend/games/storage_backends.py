from django.conf import settings
from storages.backends.s3 import S3Storage


class ProxyS3Storage(S3Storage):
    """Private S3/B2 bucket: files stay in cloud, URLs go through Django (/media/...)."""

    def url(self, name, parameters=None, expire=None, http_method=None):
        media_url = settings.MEDIA_URL
        if not media_url.endswith("/"):
            media_url = f"{media_url}/"
        return f"{media_url}{name}"
