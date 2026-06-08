import mimetypes

from django.http import FileResponse, Http404
from django.core.files.storage import default_storage


def serve_media(request, path):
    if not default_storage.exists(path):
        raise Http404("File not found")

    file_obj = default_storage.open(path)
    content_type, _ = mimetypes.guess_type(path)
    response = FileResponse(file_obj, content_type=content_type or "application/octet-stream")
    response["Cache-Control"] = "public, max-age=3600"
    return response
