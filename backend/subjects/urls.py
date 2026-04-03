from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SubjectViewSet

app_name = "subjects"

router = DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="subjects")

urlpatterns = [
    path("", include(router.urls)),
]
