import shutil
import zipfile
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def _normalize_extracted_root(build_root: Path) -> Path:
    index_path = build_root / "index.html"
    if index_path.exists():
        return build_root

    found_index = next(build_root.rglob("index.html"), None)
    if not found_index:
        return build_root

    nested_root = found_index.parent
    for item in nested_root.iterdir():
        destination = build_root / item.name
        if destination.exists():
            if destination.is_dir():
                shutil.rmtree(destination)
            else:
                destination.unlink()
        shutil.move(str(item), str(destination))

    return build_root


def delete_build_files(project_id: int) -> None:
    prefix = f"games/{project_id}/"
    if hasattr(default_storage, "bucket"):
        try:
            bucket = default_storage.bucket
            response = bucket.meta.client.list_objects_v2(
                Bucket=bucket.name,
                Prefix=prefix,
            )
            objects = [{"Key": item["Key"]} for item in response.get("Contents", [])]
            if objects:
                bucket.delete_objects(Delete={"Objects": objects})
        except Exception:
            pass
        return

    build_root = Path(settings.MEDIA_ROOT) / "games" / str(project_id)
    if build_root.exists():
        shutil.rmtree(build_root)


def upload_directory_to_storage(source_root: Path, storage_prefix: str) -> None:
    for file_path in source_root.rglob("*"):
        if not file_path.is_file():
            continue
        relative_path = file_path.relative_to(source_root).as_posix()
        storage_path = f"{storage_prefix}{relative_path}"
        with file_path.open("rb") as file_obj:
            if default_storage.exists(storage_path):
                default_storage.delete(storage_path)
            default_storage.save(storage_path, ContentFile(file_obj.read()))


def extract_build_archive(archive_file, project_id: int) -> str:
    delete_build_files(project_id)

    storage_prefix = f"games/{project_id}/"
    build_root = Path(settings.MEDIA_ROOT) / "games" / str(project_id)
    build_root.mkdir(parents=True, exist_ok=True)

    archive_path = build_root / "_upload.zip"
    with archive_file.open("rb") as source:
        archive_path.write_bytes(source.read())

    try:
        with zipfile.ZipFile(archive_path, "r") as zip_ref:
            zip_ref.extractall(build_root)
    except zipfile.BadZipFile as exc:
        raise ValueError("Некорректный ZIP архив билда.") from exc
    finally:
        if archive_path.exists():
            archive_path.unlink()

    build_root = _normalize_extracted_root(build_root)
    if not (build_root / "index.html").exists():
        raise ValueError("В архиве не найден index.html (Unity WebGL билд).")

    if hasattr(default_storage, "bucket"):
        upload_directory_to_storage(build_root, storage_prefix)
        if build_root.exists():
            shutil.rmtree(build_root)
        return f"{settings.MEDIA_URL}games/{project_id}/index.html"

    return f"{settings.MEDIA_URL}games/{project_id}/index.html"
