from rest_framework import serializers

from employees.models import Employee
from subjects.models import Subject
from .models import Exam


class ExamBaseSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = [
            "id",
            "exam_title",
            "subject",
            "subject_name",
            "total_questions",
            "total_marks",
            "exam_date",
            "start_time",
            "end_time",
            "duration_minutes",
            "status",
            "created_by",
            "created_by_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_subject_name(self, obj):
        return obj.subject.subject_name if obj.subject else None

    def get_created_by_name(self, obj):
        if not obj.created_by:
            return None
        user = obj.created_by.user
        return f"{user.first_name} {user.last_name}".strip() or user.username

    def validate(self, attrs):
        start_time = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end_time = attrs.get("end_time", getattr(self.instance, "end_time", None))

        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError(
                {"end_time": "End time must be after start time."}
            )

        return attrs


class ExamListSerializer(ExamBaseSerializer):
    pass


class ExamDetailSerializer(ExamBaseSerializer):
    pass


class ExamCreateUpdateSerializer(ExamBaseSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta(ExamBaseSerializer.Meta):
        fields = ExamBaseSerializer.Meta.fields
