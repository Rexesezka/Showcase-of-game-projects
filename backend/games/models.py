from django.db import models


class Season(models.Model):
    name = models.CharField("Название", max_length=255, unique=True)
    start_date = models.DateField("Дата начала")
    end_date = models.DateField("Дата конца")
    status = models.CharField("Статус", max_length=100)

    class Meta:
        verbose_name = "Сезон"
        verbose_name_plural = "Сезоны"
        ordering = ["-start_date", "-id"]

    def __str__(self):
        return self.name


class Project(models.Model):
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name="projects", verbose_name="Сезон")
    name = models.CharField("Название проекта", max_length=255)
    short_description = models.TextField("Краткое описание")
    full_description = models.TextField("Полное описание")
    build_url = models.CharField("Ссылка на билд", max_length=500, blank=True)
    build_archive = models.FileField("ZIP архив билда", upload_to="project_archives/", blank=True, null=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ["-updated_at", "-id"]

    def __str__(self):
        return self.name


class Media(models.Model):
    FILE_TYPE_IMAGE = "image"
    FILE_TYPE_VIDEO = "video"
    FILE_TYPE_DOCUMENT = "document"
    FILE_TYPE_OTHER = "other"

    FILE_TYPE_CHOICES = (
        (FILE_TYPE_IMAGE, "Изображение"),
        (FILE_TYPE_VIDEO, "Видео"),
        (FILE_TYPE_DOCUMENT, "Документ"),
        (FILE_TYPE_OTHER, "Другое"),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="media_items", verbose_name="Проект")
    file_type = models.CharField("Тип файла", max_length=30, choices=FILE_TYPE_CHOICES, default=FILE_TYPE_OTHER)
    file_url = models.URLField("URL файла")
    display_order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Медиа"
        verbose_name_plural = "Медиа"
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.project.name} ({self.file_type})"


class Application(models.Model):
    ROLE_EXPERT = "expert"
    ROLE_CURATOR = "curator"
    ROLE_CHOICES = (
        (ROLE_EXPERT, "Эксперт"),
        (ROLE_CURATOR, "Куратор"),
    )

    last_name = models.CharField("Фамилия", max_length=100)
    first_name = models.CharField("Имя", max_length=100)
    middle_name = models.CharField("Отчество", max_length=100, blank=True)
    contact_data = models.CharField("Контактные данные", max_length=255)
    role = models.CharField("Роль", max_length=30, choices=ROLE_CHOICES)
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.role})"
