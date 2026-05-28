import json

from django.db.models import Prefetch
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import Application, Media, Project, Season

IMAGE_MEDIA_PREFETCH = Prefetch(
    "media_items",
    queryset=Media.objects.filter(file_type=Media.FILE_TYPE_IMAGE).order_by("display_order", "id"),
)


SORT_MAPPING = {
    "updated_desc": "-updated_at",
    "updated_asc": "updated_at",
    "name_asc": "name",
    "name_desc": "-name",
    "score_desc": "-score",
    "score_asc": "score",
}


def _serialize_materials(project: Project):
    materials = [
        {"label": artifact.get_label(), "href": artifact.url}
        for artifact in project.artifacts.all()
    ]
    material_idx = 0
    for item in project.media_items.all():
        if item.file_type == Media.FILE_TYPE_IMAGE:
            continue
        material_idx += 1
        source_url = item.get_source_url()
        if source_url:
            materials.append({"label": f"Материал {material_idx}", "href": source_url})
    return materials


def _serialize_team(project: Project):
    return [{"name": member.name, "role": member.role} for member in project.team_members.all()]


def _project_images(project: Project):
    images = []
    for item in project.media_items.all():
        if item.file_type != Media.FILE_TYPE_IMAGE:
            continue
        source_url = item.get_source_url()
        if source_url:
            images.append(source_url)
    return images


def _project_cover_image(project: Project) -> str:
    images = _project_images(project)
    return images[0] if images else ""


def _serialize_project_card(project: Project):
    return {
        "id": project.id,
        "title": project.name,
        "season": project.season.name,
        "updatedAt": project.updated_at.date().isoformat(),
        "score": project.score,
        "coverImage": _project_cover_image(project),
        "images": _project_images(project),
    }


def _projects_queryset():
    return Project.objects.select_related("season").prefetch_related(IMAGE_MEDIA_PREFETCH)


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
    sort = request.GET.get("sort", "score_desc")
    order_by = SORT_MAPPING.get(sort, SORT_MAPPING["score_desc"])

    projects = _projects_queryset()
    if season_id and season_id.isdigit():
        projects = projects.filter(season_id=int(season_id))
    total = projects.count()
    projects = projects.order_by(order_by, "-id")

    return JsonResponse({"items": [_serialize_project_card(project) for project in projects], "total": total})


@require_GET
def top_projects(request):
    limit_param = request.GET.get("limit", "5")
    limit = int(limit_param) if limit_param.isdigit() else 5
    limit = max(1, min(limit, 10))

    projects = _projects_queryset().order_by("-score", "-id")[:limit]
    return JsonResponse({"items": [_serialize_project_card(project) for project in projects]})


@require_GET
def project_detail(request, project_id):
    try:
        project = (
            Project.objects.select_related("season")
            .prefetch_related("media_items", "artifacts", "team_members")
            .get(id=project_id)
        )
    except Project.DoesNotExist:
        return JsonResponse({"error": "Проект не найден"}, status=404)

    images = _project_images(project)

    data = {
        "id": project.id,
        "title": project.name,
        "subtitle": project.name,
        "season": project.season.name,
        "type": "WebGL",
        "uploadDate": project.updated_at.date().isoformat(),
        "buildUrl": project.build_url,
        "score": project.score,
        "teamName": project.team_name,
        "shortDescription": project.short_description,
        "fullDescription": project.full_description,
        "images": images,
        "materials": _serialize_materials(project),
        "team": _serialize_team(project),
    }
    return JsonResponse(data)


@require_GET
def stats(request):
    seasons_count = Season.objects.count()
    projects_count = Project.objects.count()
    curators_count = Application.objects.filter(
        role=Application.ROLE_CURATOR,
        status=Application.STATUS_APPROVED,
    ).count()

    return JsonResponse(
        {
            "stats": [
                {"label": "Сезонов", "value": str(seasons_count)},
                {"label": "Проектов", "value": str(projects_count)},
                {"label": "Кураторов", "value": str(curators_count)},
            ]
        }
    )


@csrf_exempt
@require_http_methods(["POST"])
def create_application(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Некорректный JSON"}, status=400)

    required_fields = {
        "lastName": "фамилия",
        "firstName": "имя",
        "company": "компания",
        "position": "должность",
        "contactDetails": "контактные данные",
    }
    missing = [label for field, label in required_fields.items() if not str(payload.get(field, "")).strip()]
    if missing:
        return JsonResponse({"error": f"Не заполнены поля: {', '.join(missing)}"}, status=400)

    application = Application.objects.create(
        last_name=payload["lastName"].strip(),
        first_name=payload["firstName"].strip(),
        middle_name=payload.get("middleName", "").strip(),
        company=payload["company"].strip(),
        position=payload["position"].strip(),
        contact_data=payload["contactDetails"].strip(),
        comment=payload.get("comment", "").strip(),
        role=Application.ROLE_CURATOR,
        status=Application.STATUS_PENDING,
    )
    return JsonResponse({"id": application.id, "message": "Заявка отправлена"}, status=201)
