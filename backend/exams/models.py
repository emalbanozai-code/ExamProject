from django.db import models

from core.base_models import BaseModel
from employees.models import Employee
from subjects.models import Subject


class Exam(BaseModel):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("closed", "Closed"),
    ]

    exam_title = models.CharField(max_length=200)
    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name="exams",
    )
    total_questions = models.PositiveIntegerField()
    total_marks = models.PositiveIntegerField()
    exam_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="exams_created",
    )

    class Meta:
        db_table = "exams"
        indexes = [
            models.Index(fields=["subject"], name="exams_subject_idx"),
            models.Index(fields=["status"], name="exams_status_idx"),
            models.Index(fields=["exam_date"], name="exams_exam_date_idx"),
            models.Index(fields=["created_by"], name="exams_created_by_idx"),
        ]

    def __str__(self):
        return f"{self.exam_title} ({self.subject.subject_name})"
