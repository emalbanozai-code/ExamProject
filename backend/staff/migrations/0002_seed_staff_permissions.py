from django.db import migrations


def seed_staff_permissions(apps, schema_editor):
    Permission = apps.get_model("core", "Permission")
    RolePermission = apps.get_model("accounts", "RolePermission")

    action_map = {
        "admin": ["all"],
        "receptionist": ["view", "add", "change"],
        "viewer": ["view"],
    }

    created_permissions = {}
    for action in ["view", "add", "change", "delete", "all"]:
        permission, _ = Permission.objects.get_or_create(
            module="staff",
            action=action,
            defaults={"description": f"Can {action} staff"},
        )
        created_permissions[action] = permission

    for role_name, actions in action_map.items():
        for action in actions:
            RolePermission.objects.get_or_create(
                role_name=role_name,
                permission=created_permissions[action],
            )


def reverse_seed_staff_permissions(apps, schema_editor):
    Permission = apps.get_model("core", "Permission")
    RolePermission = apps.get_model("accounts", "RolePermission")

    staff_permissions = Permission.objects.filter(module="staff")
    RolePermission.objects.filter(permission__in=staff_permissions).delete()
    staff_permissions.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
        ("core", "0003_add_trainers_module_choice"),
        ("staff", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_staff_permissions, reverse_seed_staff_permissions),
    ]

