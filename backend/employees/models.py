from django.conf import settings
from django.db import models

from core.base_models import BaseModel


class Employee(BaseModel):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("instructor", "Instructor"),
        ("staff", "Staff"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="employee_profile",
    )
    father_name = models.CharField(max_length=150, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    work_days = models.JSONField(default=list, blank=True)
    join_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    class Meta:
        db_table = "employees"
        indexes = [
            models.Index(fields=["role"]),
            models.Index(fields=["status"]),
            models.Index(fields=["join_date"]),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.role})"
