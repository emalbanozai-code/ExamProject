from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import PermissionMixin
from .models import Exam
from .serializers import (
    ExamListSerializer,
    ExamDetailSerializer,
    ExamCreateUpdateSerializer,
)


class ExamViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Exam.objects.select_related(
        "subject",
        "created_by",
        "created_by__user",
    ).all()
    permission_classes = [IsAuthenticated]
    permission_module = "exams"

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "subject", "created_by", "exam_date"]
    search_fields = [
        "exam_title",
        "subject__subject_name",
        "created_by__user__first_name",
        "created_by__user__last_name",
        "created_by__user__username",
    ]
    ordering_fields = [
        "created_at",
        "updated_at",
        "exam_date",
        "start_time",
        "total_marks",
        "total_questions",
    ]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in {"list"}:
            return ExamListSerializer
        if self.action in {"retrieve"}:
            return ExamDetailSerializer
        return ExamCreateUpdateSerializer

    def perform_create(self, serializer):
        created_by = serializer.validated_data.get("created_by")
        if created_by is None:
            employee = getattr(self.request.user, "employee_profile", None)
            if employee is None:
                raise ValidationError({"created_by": "Created by is required."})
            serializer.save(created_by=employee)
            return
        serializer.save()

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        exam = self.get_object()
        exam.status = "active"
        exam.save(update_fields=["status", "updated_at"])
        return Response({"message": "Exam activated"})

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        exam = self.get_object()
        exam.status = "closed"
        exam.save(update_fields=["status", "updated_at"])
        return Response({"message": "Exam closed"})
