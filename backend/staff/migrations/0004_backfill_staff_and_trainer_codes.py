from django.db import migrations


def _build_code(prefix, used_codes):
    next_number = 1
    while True:
        candidate = f"{prefix}-{next_number:06d}"
        if candidate not in used_codes:
            used_codes.add(candidate)
            return candidate
        next_number += 1


def backfill_codes(apps, schema_editor):
    Staff = apps.get_model("staff", "Staff")
    Trainer = apps.get_model("staff", "Trainer")

    used_staff_codes = set(
        code for code in Staff.objects.exclude(staff_code__isnull=True).values_list("staff_code", flat=True) if code
    )
    used_trainer_codes = set(
        code
        for code in Trainer.objects.exclude(trainer_code__isnull=True).values_list("trainer_code", flat=True)
        if code
    )

    for staff in Staff.objects.filter(staff_code=""):
        staff.staff_code = _build_code("STF", used_staff_codes)
        staff.save(update_fields=["staff_code"])

    for trainer in Trainer.objects.filter(trainer_code=""):
        trainer.trainer_code = _build_code("TRN", used_trainer_codes)
        trainer.save(update_fields=["trainer_code"])


class Migration(migrations.Migration):

    dependencies = [
        ("staff", "0003_migrate_trainers_to_staff"),
    ]

    operations = [
        migrations.RunPython(backfill_codes, migrations.RunPython.noop),
    ]

