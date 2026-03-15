# Generated migration

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200, verbose_name='Название игры')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('upload_date', models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')),
                ('build_path', models.CharField(max_length=500, verbose_name='Путь к билду')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активна')),
            ],
            options={
                'verbose_name': 'Игра',
                'verbose_name_plural': 'Игры',
                'ordering': ['-upload_date'],
            },
        ),
    ]
