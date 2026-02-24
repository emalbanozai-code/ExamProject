from django.db import migrations


def _build_code(prefix, used_codes):
    next_number = 1
    while True:
        candidate = f"{prefix}-{next_number:06d}"
        if candidate not in used_codes:
            used_codes.add(candidate)
            return candidate
        next_number += 1


def _migrate_permissions(apps):
    Permission = apps.get_model("core", "Permission")
    RolePermission = apps.get_model("accounts", "RolePermission")
    UserPermission = apps.get_model("accounts", "UserPermission")

    staff_permissions = {}
    for action in ["view", "add", "change", "delete", "all"]:
        permission, _ = Permission.objects.get_or_create(
            module="staff",
            action=action,
            defaults={"description": f"Can {action} staff"},
        )
        staff_permissions[action] = permission

    trainer_permissions = list(Permission.objects.filter(module="trainers"))
    if not trainer_permissions:
        return

    trainer_permission_ids = [permission.id for permission in trainer_permissions]
    action_by_permission_id = {permission.id: permission.action for permission in trainer_permissions}

    for role_permission in RolePermission.objects.filter(permission_id__in=trainer_permission_ids):
        action = action_by_permission_id[role_permission.permission_id]
        mapped_permission = staff_permissions.get(action) or staff_permissions["view"]
        RolePermission.objects.get_or_create(
            role_name=role_permission.role_name,
            permission=mapped_permission,
        )

    for user_permission in UserPermission.objects.filter(permission_id__in=trainer_permission_ids):
        action = action_by_permission_id[user_permission.permission_id]
        mapped_permission = staff_permissions.get(action) or staff_permissions["view"]
        target, created = UserPermission.objects.get_or_create(
            user_id=user_permission.user_id,
            permission=mapped_permission,
            defaults={"allow": user_permission.allow},
        )
        if not created and target.allow != user_permission.allow:
            target.allow = user_permission.allow
            target.save(update_fields=["allow"])

    Permission.objects.filter(id__in=trainer_permission_ids).delete()


def _migrate_trainer_data(apps, schema_editor):
    Staff = apps.get_model("staff", "Staff")
    Trainer = apps.get_model("staff", "Trainer")
    connection = schema_editor.connection

    if "trainers" not in connection.introspection.table_names():
        return

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                trainer_code,
                id_card_number,
                first_name,
                last_name,
                father_name,
                mobile_number,
                whatsapp_number,
                email,
                blood_group,
                profile_picture,
                date_of_birth,
                date_hired,
                monthly_salary,
                salary_currency,
                salary_status,
                employment_status,
                notes,
                deleted_at
            FROM trainers
            """
        )
        rows = cursor.fetchall()

    used_staff_codes = set(filter(None, Staff.objects.values_list("staff_code", flat=True)))
    used_trainer_codes = set(filter(None, Trainer.objects.values_list("trainer_code", flat=True)))

    for (
        trainer_code,
        id_card_number,
        first_name,
        last_name,
        father_name,
        mobile_number,
        whatsapp_number,
        email,
        blood_group,
        profile_picture,
        date_of_birth,
        date_hired,
        monthly_salary,
        salary_currency,
        salary_status,
        employment_status,
        notes,
        deleted_at,
    ) in rows:
        resolved_staff_code = _build_code("STF", used_staff_codes)
        resolved_trainer_code = trainer_code if trainer_code and trainer_code not in used_trainer_codes else None
        if not resolved_trainer_code:
            resolved_trainer_code = _build_code("TRN", used_trainer_codes)
        else:
            used_trainer_codes.add(resolved_trainer_code)

        staff = Staff.objects.create(
            staff_code=resolved_staff_code,
            position="trainer",
            id_card_number=id_card_number,
            first_name=first_name,
            last_name=last_name,
            father_name=father_name,
            mobile_number=mobile_number,
            whatsapp_number=whatsapp_number,
            email=email,
            blood_group=blood_group,
            profile_picture=profile_picture,
            date_of_birth=date_of_birth,
            date_hired=date_hired,
            monthly_salary=monthly_salary,
            salary_currency=salary_currency or "AFN",
            salary_status=salary_status or "unpaid",
            employment_status=employment_status or "active",
            attendance_status="unknown",
            notes=notes,
        )

        trainer = Trainer.objects.create(
            staff=staff,
            trainer_code=resolved_trainer_code,
        )

        if deleted_at:
            Staff.all_objects.filter(pk=staff.pk).update(deleted_at=deleted_at)
            Trainer.all_objects.filter(pk=trainer.pk).update(deleted_at=deleted_at)


def migrate_trainers_to_staff(apps, schema_editor):
    _migrate_permissions(apps)
    _migrate_trainer_data(apps, schema_editor)


class Migration(migrations.Migration):

    dependencies = [
        ("staff", "0002_seed_staff_permissions"),
    ]

    operations = [
        migrations.RunPython(migrate_trainers_to_staff, migrations.RunPython.noop),
    ]
