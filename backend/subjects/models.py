from django.db import models

from core.base_models import BaseModel
from employees.models import Employee


class Subject(BaseModel):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    subject_name = models.CharField(max_length=150)
    subject_code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    total_marks = models.PositiveIntegerField()
    pass_marks = models.PositiveIntegerField()
    duration_minutes = models.PositiveIntegerField()
    instructor = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="subjects",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    class Meta:
        db_table = "subjects"
        indexes = [
            models.Index(fields=["subject_code"], name="subjects_code_idx"),
            models.Index(fields=["status"], name="subjects_status_idx"),
        ]

    def __str__(self):
        return f"{self.subject_name} ({self.subject_code})"
