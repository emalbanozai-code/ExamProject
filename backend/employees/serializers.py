from typing import Iterable
import json

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Employee

User = get_user_model()

ALLOWED_WORK_DAYS = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"}


class EmployeeBaseSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")
    username = serializers.CharField(source="user.username")
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            "id",
            "first_name",
            "last_name",
            "profile_picture",
            "profile_picture_url",
            "father_name",
            "date_of_birth",
            "gender",
            "address",
            "phone_number",
            "email",
            "role",
            "salary",
            "work_days",
            "join_date",
            "status",
            "username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_profile_picture_url(self, obj):
        if not obj.profile_picture:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return obj.profile_picture.url


class EmployeeListSerializer(EmployeeBaseSerializer):
    class Meta(EmployeeBaseSerializer.Meta):
        fields = [
            "id",
            "first_name",
            "last_name",
            "profile_picture_url",
            "father_name",
            "date_of_birth",
            "gender",
            "address",
            "phone_number",
            "email",
            "role",
            "salary",
            "work_days",
            "join_date",
            "status",
            "username",
            "created_at",
            "updated_at",
        ]


class EmployeeDetailSerializer(EmployeeBaseSerializer):
    pass


class EmployeeCreateUpdateSerializer(EmployeeBaseSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta(EmployeeBaseSerializer.Meta):
        fields = EmployeeBaseSerializer.Meta.fields + ["password"]

    def validate_email(self, value: str):
        user_id = self._get_user_id()
        exists = User.objects.filter(email__iexact=value)
        if user_id:
            exists = exists.exclude(id=user_id)
        if exists.exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_username(self, value: str):
        user_id = self._get_user_id()
        exists = User.objects.filter(username__iexact=value)
        if user_id:
            exists = exists.exclude(id=user_id)
        if exists.exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_work_days(self, value):
        if value in (None, ""):
            return []
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                try:
                    parsed = json.loads(text)
                except json.JSONDecodeError as exc:
                    raise serializers.ValidationError("Invalid work days format.") from exc
                if not isinstance(parsed, list):
                    raise serializers.ValidationError("Invalid work days format.")
                items = [str(v).strip().lower() for v in parsed if str(v).strip()]
            else:
                items = [v.strip().lower() for v in value.split(",") if v.strip()]
        elif isinstance(value, Iterable):
            items = [str(v).strip().lower() for v in value]
        else:
            raise serializers.ValidationError("Invalid work days format.")

        invalid = [v for v in items if v not in ALLOWED_WORK_DAYS]
        if invalid:
            raise serializers.ValidationError(
                "Invalid work day values: " + ", ".join(invalid)
            )
        return items

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        password = validated_data.pop("password", None) or None

        role = validated_data.get("role")
        role_name = "admin" if role == "admin" else "viewer"

        user = User(
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
            email=user_data.get("email", ""),
            username=user_data.get("username", ""),
            role_name=role_name,
        )
        if password:
            user.set_password(password)
        else:
            user.set_password(User.objects.make_random_password())
        user.save()

        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        password = validated_data.pop("password", None)

        user = instance.user
        if "first_name" in user_data:
            user.first_name = user_data["first_name"]
        if "last_name" in user_data:
            user.last_name = user_data["last_name"]
        if "email" in user_data:
            user.email = user_data["email"]
        if "username" in user_data:
            user.username = user_data["username"]

        role = validated_data.get("role", instance.role)
        user.role_name = "admin" if role == "admin" else "viewer"

        if password:
            user.set_password(password)
        user.save()

        return super().update(instance, validated_data)

    def _get_user_id(self):
        if self.instance and hasattr(self.instance, "user"):
            return self.instance.user_id
        return None
