from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import PermissionMixin
from .models import Student
from .serializers import (
    StudentListSerializer,
    StudentDetailSerializer,
    StudentCreateUpdateSerializer,
)


class StudentViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Student.objects.select_related("user").all()
    permission_classes = [IsAuthenticated]
    permission_module = "students"
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "gender", "course_department"]
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__email",
        "user__username",
        "registration_number",
        "phone_number",
    ]
    ordering_fields = ["created_at", "updated_at", "enrollment_date"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in {"list"}:
            return StudentListSerializer
        if self.action in {"retrieve"}:
            return StudentDetailSerializer
        return StudentCreateUpdateSerializer

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        student = self.get_object()
        student.status = "active"
        student.save(update_fields=["status", "updated_at"])
        return Response({"message": "Student activated"})

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        student = self.get_object()
        student.status = "inactive"
        student.save(update_fields=["status", "updated_at"])
        return Response({"message": "Student deactivated"})
