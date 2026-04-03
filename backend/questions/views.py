from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import PermissionMixin
from .models import Question
from .serializers import (
    QuestionListSerializer,
    QuestionDetailSerializer,
    QuestionCreateUpdateSerializer,
)


class QuestionViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Question.objects.select_related(
        "subject",
        "created_by",
        "created_by__user",
    ).all()
    permission_classes = [IsAuthenticated]
    permission_module = "questions"

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["difficulty_level", "subject", "created_by"]
    search_fields = [
        "question_text",
        "subject__subject_name",
        "created_by__user__first_name",
        "created_by__user__last_name",
        "created_by__user__username",
    ]
    ordering_fields = ["created_at", "updated_at", "marks", "difficulty_level"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in {"list"}:
            return QuestionListSerializer
        if self.action in {"retrieve"}:
            return QuestionDetailSerializer
        return QuestionCreateUpdateSerializer

    def perform_create(self, serializer):
        created_by = serializer.validated_data.get("created_by")
        if created_by is None:
            employee = getattr(self.request.user, "employee_profile", None)
            if employee is None:
                raise ValidationError({"created_by": "Created by is required."})
            serializer.save(created_by=employee)
            return
        serializer.save()
