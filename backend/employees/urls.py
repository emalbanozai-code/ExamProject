from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import EmployeeViewSet

app_name = "employees"

router = DefaultRouter()
router.register(r"employees", EmployeeViewSet, basename="employees")

urlpatterns = [
    path("", include(router.urls)),
]
