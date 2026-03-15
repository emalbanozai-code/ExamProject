from django.db.models import Q
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import PermissionMixin
from .models import Employee
from .serializers import (
    EmployeeListSerializer,
    EmployeeDetailSerializer,
    EmployeeCreateUpdateSerializer,
)


class EmployeeViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Employee.objects.select_related("user").all()
    permission_classes = [IsAuthenticated]
    permission_module = "employees"

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "role"]
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__email",
        "user__username",
        "phone_number",
    ]
    ordering_fields = ["created_at", "updated_at", "join_date"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in {"list"}:
            return EmployeeListSerializer
        if self.action in {"retrieve"}:
            return EmployeeDetailSerializer
        return EmployeeCreateUpdateSerializer

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        employee = self.get_object()
        employee.status = "active"
        employee.save(update_fields=["status", "updated_at"])
        return Response({"message": "Employee activated"})

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        employee = self.get_object()
        employee.status = "inactive"
        employee.save(update_fields=["status", "updated_at"])
        return Response({"message": "Employee deactivated"})
