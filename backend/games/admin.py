import shutil
import zipfile
from pathlib import Path

from django import forms
from django.conf import settings
from django.contrib import admin
from django.core.exceptions import ValidationError

from .models import Application, Media, Project, ProjectArtifact, Season, TeamMember


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "status")
    list_filter = ("status",)
    search_fields = ("name",)


class MediaInlineForm(forms.ModelForm):
    class Meta:
        model = Media
        fields = ("file_type", "image_file", "file_url", "display_order")

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("DELETE"):
            return cleaned_data

        file_type = cleaned_data.get("file_type")
        image_file = cleaned_data.get("image_file")
        file_url = (cleaned_data.get("file_url") or "").strip()

        if file_type == Media.FILE_TYPE_IMAGE and not image_file and not file_url:
            raise ValidationError(
                "Для изображения загрузите файл или укажите публичную ссылку (https://...)."
            )

        if file_url and file_url.startswith(("file:", "C:", "D:", "/", "\\")):
            if "://" not in file_url:
                raise ValidationError(
                    "Укажите ссылку https://... или загрузите файл. "
                    "Локальный путь Windows (C:\\...) не поддерживается."
                )

        return cleaned_data


class MediaInline(admin.TabularInline):
    model = Media
    form = MediaInlineForm
    extra = 0
    fields = ("file_type", "image_file", "file_url", "display_order")
    verbose_name = "Изображение"
    verbose_name_plural = "Изображения для карточки"


class ProjectArtifactInline(admin.TabularInline):
    model = ProjectArtifact
    extra = 1
    fields = ("artifact_type", "title", "url", "display_order")


class TeamMemberInline(admin.TabularInline):
    model = TeamMember
    extra = 1
    fields = ("name", "role", "display_order")


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = "__all__"

    def clean_build_archive(self):
        archive = self.cleaned_data.get("build_archive")
        if archive and not archive.name.lower().endswith(".zip"):
            raise ValidationError("Загрузите ZIP архив билда.")
        return archive

    def clean_score(self):
        score = self.cleaned_data.get("score")
        if score is not None and not 0 <= score <= 100:
            raise ValidationError("Оценка должна быть от 0 до 100.")
        return score


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ("name", "season", "score", "team_name", "updated_at", "build_url")
    list_filter = ("season",)
    search_fields = ("name", "short_description", "full_description", "team_name")
    readonly_fields = ("build_url",)
    inlines = (MediaInline, ProjectArtifactInline, TeamMemberInline)
    fieldsets = (
        (
            "Основное",
            {
                "fields": (
                    "season",
                    "name",
                    "short_description",
                    "full_description",
                )
            },
        ),
        (
            "Оценка и команда",
            {
                "fields": (
                    "score",
                    "team_name",
                )
            },
        ),
        (
            "Билд игры",
            {
                "fields": (
                    "build_archive",
                    "build_url",
                )
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        archive = obj.build_archive
        if not archive:
            return

        build_root = Path(settings.MEDIA_ROOT) / "games" / str(obj.id)
        if build_root.exists():
            shutil.rmtree(build_root)
        build_root.mkdir(parents=True, exist_ok=True)

        archive_path = Path(archive.path)
        try:
            with zipfile.ZipFile(archive_path, "r") as zip_ref:
                zip_ref.extractall(build_root)
        except zipfile.BadZipFile as exc:
            raise ValidationError("Некорректный ZIP архив билда.") from exc

        index_path = build_root / "index.html"
        if not index_path.exists():
            found_index = next(build_root.rglob("index.html"), None)
            if found_index:
                nested_root = found_index.parent
                for item in nested_root.iterdir():
                    destination = build_root / item.name
                    if destination.exists():
                        if destination.is_dir():
                            shutil.rmtree(destination)
                        else:
                            destination.unlink()
                    shutil.move(str(item), str(destination))
            index_path = build_root / "index.html"

        if not index_path.exists():
            raise ValidationError("В архиве не найден index.html (Unity WebGL билд).")

        obj.build_url = f"{settings.MEDIA_URL}games/{obj.id}/index.html"
        obj.save(update_fields=["build_url"])


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "last_name",
        "first_name",
        "company",
        "position",
        "status",
        "contact_data",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "last_name",
        "first_name",
        "middle_name",
        "company",
        "position",
        "contact_data",
        "comment",
    )
    readonly_fields = ("created_at",)
    actions = ("approve_applications", "reject_applications")
    fieldsets = (
        (
            "Заявитель",
            {
                "fields": (
                    "last_name",
                    "first_name",
                    "middle_name",
                    "company",
                    "position",
                    "contact_data",
                )
            },
        ),
        (
            "Заявка",
            {
                "fields": (
                    "comment",
                    "role",
                    "status",
                    "created_at",
                )
            },
        ),
    )

    @admin.action(description="Одобрить выбранные заявки")
    def approve_applications(self, request, queryset):
        updated = queryset.filter(status=Application.STATUS_PENDING).update(
            status=Application.STATUS_APPROVED
        )
        self.message_user(request, f"Одобрено заявок: {updated}")

    @admin.action(description="Отклонить и удалить выбранные заявки")
    def reject_applications(self, request, queryset):
        deleted_count, _ = queryset.delete()
        self.message_user(request, f"Удалено заявок: {deleted_count}")
