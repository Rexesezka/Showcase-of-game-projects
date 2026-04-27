import json

from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods

from .models import Application, Media, Project, Season


SORT_MAPPING = {
    "updated_desc": "-updated_at",
    "updated_asc": "updated_at",
    "name_asc": "name",
    "name_desc": "-name",
}


def _serialize_project_card(project: Project):
    return {
        "id": project.id,
        "title": project.name,
        "season": project.season.name,
        "updatedAt": project.updated_at.date().isoformat(),
    }


@require_GET
def seasons_list(request):
    seasons = Season.objects.all()
    data = [
        {
            "id": season.id,
            "name": season.name,
            "startDate": season.start_date.isoformat(),
            "endDate": season.end_date.isoformat(),
            "status": season.status,
        }
        for season in seasons
    ]
    return JsonResponse({"items": data})


@require_GET
def projects_list(request):
    season_id = request.GET.get("season")
    sort = request.GET.get("sort", "updated_desc")
    order_by = SORT_MAPPING.get(sort, SORT_MAPPING["updated_desc"])

    projects = Project.objects.select_related("season").all()
    if season_id and season_id.isdigit():
        projects = projects.filter(season_id=int(season_id))
    projects = projects.order_by(order_by, "-id")

    return JsonResponse({"items": [_serialize_project_card(project) for project in projects]})


@require_GET
def project_detail(request, project_id):
    try:
        project = Project.objects.select_related("season").get(id=project_id)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Проект не найден"}, status=404)

    media_items = list(project.media_items.all())
    images = [item.file_url for item in media_items if item.file_type == Media.FILE_TYPE_IMAGE]
    materials = [
        {"label": f"Материал {idx + 1}", "href": item.file_url}
        for idx, item in enumerate(media_items)
        if item.file_type != Media.FILE_TYPE_IMAGE
    ]

    data = {
        "id": project.id,
        "title": project.name,
        "subtitle": project.name,
        "season": project.season.name,
        "type": "WebGL",
        "uploadDate": project.updated_at.date().isoformat(),
        "buildUrl": project.build_url,
        "shortDescription": project.short_description,
        "fullDescription": project.full_description,
        "images": images,
        "materials": materials,
        "team": [],
    }
    return JsonResponse(data)


@require_GET
def stats(request):
    seasons_count = Season.objects.count()
    projects_count = Project.objects.count()
    experts_count = Application.objects.filter(role=Application.ROLE_EXPERT).count()

    return JsonResponse(
        {
            "stats": [
                {"label": "Сезонов", "value": str(seasons_count)},
                {"label": "Проектов", "value": str(projects_count)},
                {"label": "Экспертов", "value": str(experts_count)},
            ]
        }
    )


@require_http_methods(["POST"])
def create_application(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Некорректный JSON"}, status=400)

    required_fields = ("lastName", "firstName", "contactData", "role")
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        return JsonResponse({"error": f"Не заполнены поля: {', '.join(missing)}"}, status=400)

    role = payload.get("role")
    if role not in {Application.ROLE_EXPERT, Application.ROLE_CURATOR}:
        return JsonResponse({"error": "Некорректная роль"}, status=400)

    application = Application.objects.create(
        last_name=payload["lastName"].strip(),
        first_name=payload["firstName"].strip(),
        middle_name=payload.get("middleName", "").strip(),
        contact_data=payload["contactData"].strip(),
        role=role,
    )
    return JsonResponse({"id": application.id, "message": "Заявка отправлена"}, status=201)
