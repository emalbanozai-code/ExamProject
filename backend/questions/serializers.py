from rest_framework import serializers

from employees.models import Employee
from subjects.models import Subject
from .models import Question


class QuestionBaseSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "id",
            "subject",
            "subject_name",
            "question_text",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_answer",
            "marks",
            "difficulty_level",
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


class QuestionListSerializer(QuestionBaseSerializer):
    pass


class QuestionDetailSerializer(QuestionBaseSerializer):
    pass


class QuestionCreateUpdateSerializer(QuestionBaseSerializer):
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta(QuestionBaseSerializer.Meta):
        fields = QuestionBaseSerializer.Meta.fields
