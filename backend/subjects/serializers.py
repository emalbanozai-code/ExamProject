from rest_framework import serializers

from employees.models import Employee
from .models import Subject


class SubjectBaseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            "id",
            "subject_name",
            "subject_code",
            "description",
            "total_marks",
            "pass_marks",
            "duration_minutes",
            "instructor",
            "instructor_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_instructor_name(self, obj):
        if not obj.instructor:
            return None
        user = obj.instructor.user
        return f"{user.first_name} {user.last_name}".strip() or user.username

    def validate(self, attrs):
        total = attrs.get("total_marks", getattr(self.instance, "total_marks", None))
        passing = attrs.get("pass_marks", getattr(self.instance, "pass_marks", None))
        if total is not None and passing is not None and passing > total:
            raise serializers.ValidationError(
                {"pass_marks": "Pass marks cannot exceed total marks."}
            )
        return attrs


class SubjectListSerializer(SubjectBaseSerializer):
    pass


class SubjectDetailSerializer(SubjectBaseSerializer):
    pass


class SubjectCreateUpdateSerializer(SubjectBaseSerializer):
    instructor = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())

    class Meta(SubjectBaseSerializer.Meta):
        fields = SubjectBaseSerializer.Meta.fields
