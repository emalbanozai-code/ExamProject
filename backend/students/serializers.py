from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Student

User = get_user_model()


class StudentBaseSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")
    username = serializers.CharField(source="user.username")
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = Student
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
            "registration_number",
            "course_department",
            "enrollment_date",
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


class StudentListSerializer(StudentBaseSerializer):
    class Meta(StudentBaseSerializer.Meta):
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
            "registration_number",
            "course_department",
            "enrollment_date",
            "status",
            "username",
            "created_at",
            "updated_at",
        ]


class StudentDetailSerializer(StudentBaseSerializer):
    pass


class StudentCreateUpdateSerializer(StudentBaseSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta(StudentBaseSerializer.Meta):
        fields = StudentBaseSerializer.Meta.fields + ["password"]

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

    def validate_registration_number(self, value: str):
        qs = Student.objects.filter(registration_number__iexact=value)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Registration number already exists.")
        return value

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        password = validated_data.pop("password", None) or None

        user = User(
            first_name=user_data.get("first_name", ""),
            last_name=user_data.get("last_name", ""),
            email=user_data.get("email", ""),
            username=user_data.get("username", ""),
            role_name="viewer",
        )
        if password:
            user.set_password(password)
        else:
            user.set_password(User.objects.make_random_password())
        user.save()

        student = Student.objects.create(user=user, **validated_data)
        return student

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
        if password:
            user.set_password(password)
        user.save()

        return super().update(instance, validated_data)

    def _get_user_id(self):
        if self.instance and hasattr(self.instance, "user"):
            return self.instance.user_id
        return None
