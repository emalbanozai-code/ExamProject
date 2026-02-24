from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.pagination import StandardResultsSetPagination
from core.permissions import PermissionMixin

from .models import Staff
from .serializers import StaffDetailSerializer, StaffListSerializer, StaffWriteSerializer


class StaffViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]
    permission_module = "staff"
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["position", "employment_status", "salary_status"]
    search_fields = [
        "staff_code",
        "id_card_number",
        "first_name",
        "last_name",
        "mobile_number",
        "email",
    ]
    ordering_fields = ["created_at", "date_hired", "last_name", "monthly_salary"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return StaffListSerializer
        if self.action in ("create", "update", "partial_update"):
            return StaffWriteSerializer
        return StaffDetailSerializer

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        staff = self.get_object()
        staff.employment_status = "active"
        staff.save(update_fields=["employment_status", "updated_at"])
        return Response({"message": "Staff activated successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        staff = self.get_object()
        staff.employment_status = "inactive"
        staff.save(update_fields=["employment_status", "updated_at"])
        return Response({"message": "Staff deactivated successfully."}, status=status.HTTP_200_OK)
