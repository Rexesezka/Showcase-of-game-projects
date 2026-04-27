import shutil
import zipfile
from pathlib import Path

from django import forms
from django.conf import settings
from django.contrib import admin
from django.core.exceptions import ValidationError

from .models import Application, Media, Project, Season


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "status")
    list_filter = ("status",)
    search_fields = ("name",)


class MediaInline(admin.TabularInline):
    model = Media
    extra = 0


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = "__all__"

    def clean_build_archive(self):
        archive = self.cleaned_data.get("build_archive")
        if archive and not archive.name.lower().endswith(".zip"):
            raise ValidationError("Загрузите ZIP архив билда.")
        return archive


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ("name", "season", "updated_at", "build_url")
    list_filter = ("season",)
    search_fields = ("name", "short_description", "full_description")
    readonly_fields = ("build_url",)
    inlines = (MediaInline,)

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
    list_display = ("last_name", "first_name", "role", "contact_data", "created_at")
    list_filter = ("role", "created_at")
    search_fields = ("last_name", "first_name", "middle_name", "contact_data")
