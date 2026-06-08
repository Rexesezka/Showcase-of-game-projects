from django.core.management.base import BaseCommand

from games.storage_backends import check_storage_connection


class Command(BaseCommand):
    help = "Проверяет подключение к Backblaze B2 / S3 хранилищу"

    def handle(self, *args, **options):
        try:
            result = check_storage_connection()
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"Ошибка хранилища: {exc}"))
            raise SystemExit(1) from exc

        self.stdout.write(self.style.SUCCESS(f"Хранилище работает: {result}"))
