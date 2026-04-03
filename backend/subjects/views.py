from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import PermissionMixin
from .models import Subject
from .serializers import (
    SubjectListSerializer,
    SubjectDetailSerializer,
    SubjectCreateUpdateSerializer,
)


class SubjectViewSet(PermissionMixin, viewsets.ModelViewSet):
    queryset = Subject.objects.select_related("instructor", "instructor__user").all()
    permission_classes = [IsAuthenticated]
    permission_module = "subjects"

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "instructor"]
    search_fields = [
        "subject_name",
        "subject_code",
        "instructor__user__first_name",
        "instructor__user__last_name",
        "instructor__user__username",
    ]
    ordering_fields = ["created_at", "updated_at", "subject_name", "subject_code"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in {"list"}:
            return SubjectListSerializer
        if self.action in {"retrieve"}:
            return SubjectDetailSerializer
        return SubjectCreateUpdateSerializer

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        subject = self.get_object()
        subject.status = "active"
        subject.save(update_fields=["status", "updated_at"])
        return Response({"message": "Subject activated"})

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        subject = self.get_object()
        subject.status = "inactive"
        subject.save(update_fields=["status", "updated_at"])
        return Response({"message": "Subject deactivated"})
