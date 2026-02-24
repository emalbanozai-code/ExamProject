from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.pagination import StandardResultsSetPagination
from core.permissions import PermissionMixin

from .models import Member
from .serializers import MemberDetailSerializer, MemberListSerializer, MemberWriteSerializer


class MemberViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]
    permission_module = "members"
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["member_code", "id_card_number", "first_name", "last_name", "phone", "email"]
    ordering_fields = ["created_at", "join_date", "last_name"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return MemberListSerializer
        if self.action in ("create", "update", "partial_update"):
            return MemberWriteSerializer
        return MemberDetailSerializer

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        member = self.get_object()
        member.status = "active"
        member.save()
        return Response({"message": "Member activated successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        member = self.get_object()
        member.status = "inactive"
        member.save()
        return Response({"message": "Member deactivated successfully."}, status=status.HTTP_200_OK)
