from django.core.validators import MaxValueValidator, MinValueValidator
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
    score = models.PositiveSmallIntegerField(
        "Оценка",
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Оценка от 0 до 100 баллов",
    )
    team_name = models.CharField("Название команды", max_length=255, blank=True)
    build_url = models.CharField("Ссылка на билд", max_length=500, blank=True)
    build_archive = models.FileField("ZIP архив билда", upload_to="project_archives/", blank=True, null=True)
    updated_at = models.DateTimeField("Дата обновления", auto_now=True)

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ["-updated_at", "-id"]

    def __str__(self):
        return self.name


class ProjectArtifact(models.Model):
    TYPE_GIT = "git"
    TYPE_FIGMA = "figma"
    TYPE_DRIVE = "drive"
    TYPE_OTHER = "other"

    TYPE_CHOICES = (
        (TYPE_GIT, "Git"),
        (TYPE_FIGMA, "Figma"),
        (TYPE_DRIVE, "Google Drive"),
        (TYPE_OTHER, "Другое"),
    )

    TYPE_LABELS = {
        TYPE_GIT: "Git",
        TYPE_FIGMA: "Figma",
        TYPE_DRIVE: "Google Drive",
        TYPE_OTHER: "Другое",
    }

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="artifacts",
        verbose_name="Проект",
    )
    artifact_type = models.CharField("Тип артефакта", max_length=30, choices=TYPE_CHOICES)
    title = models.CharField("Название", max_length=100, blank=True)
    url = models.URLField("Ссылка")
    display_order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Артефакт"
        verbose_name_plural = "Артефакты"
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.get_label()} — {self.project.name}"

    def get_label(self) -> str:
        if self.title.strip():
            return self.title.strip()
        return self.TYPE_LABELS.get(self.artifact_type, self.artifact_type)


class TeamMember(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="team_members",
        verbose_name="Проект",
    )
    name = models.CharField("Имя", max_length=150)
    role = models.CharField("Роль в команде", max_length=150)
    display_order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Участник команды"
        verbose_name_plural = "Состав команды"
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.name} ({self.role})"


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
    image_file = models.ImageField(
        "Файл изображения",
        upload_to="project_images/",
        blank=True,
        null=True,
        help_text="Загрузите картинку с компьютера (рекомендуется для обложки карточки).",
    )
    file_url = models.URLField(
        "Ссылка на файл",
        blank=True,
        help_text="Альтернатива загрузке: публичная ссылка https://... (не путь вида C:\\Users\\...).",
    )
    display_order = models.PositiveIntegerField("Порядок отображения", default=0)

    class Meta:
        verbose_name = "Медиа"
        verbose_name_plural = "Медиа"
        ordering = ["display_order", "id"]

    def __str__(self):
        return f"{self.project.name} ({self.file_type})"

    def get_source_url(self) -> str:
        if self.image_file:
            return self.image_file.url
        return self.file_url or ""


class Application(models.Model):
    ROLE_EXPERT = "expert"
    ROLE_CURATOR = "curator"
    ROLE_CHOICES = (
        (ROLE_EXPERT, "Эксперт"),
        (ROLE_CURATOR, "Куратор"),
    )

    STATUS_PENDING = "pending"
    STATUS_APPROVED = "approved"
    STATUS_CHOICES = (
        (STATUS_PENDING, "На рассмотрении"),
        (STATUS_APPROVED, "Одобрена"),
    )

    last_name = models.CharField("Фамилия", max_length=100)
    first_name = models.CharField("Имя", max_length=100)
    middle_name = models.CharField("Отчество", max_length=100, blank=True)
    company = models.CharField("Компания", max_length=255, blank=True)
    position = models.CharField("Должность", max_length=255, blank=True)
    contact_data = models.CharField("Контактные данные", max_length=255)
    comment = models.TextField("Комментарий / вопрос", blank=True)
    role = models.CharField("Роль", max_length=30, choices=ROLE_CHOICES, default=ROLE_EXPERT)
    status = models.CharField(
        "Статус",
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.last_name} {self.first_name} ({self.role})"
