from django.conf import settings
from django.db import models

from core.base_models import BaseModel


class Student(BaseModel):
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    profile_picture = models.ImageField(
        upload_to="students/profile_pictures/",
        blank=True,
        null=True,
    )
    father_name = models.CharField(max_length=150, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    registration_number = models.CharField(max_length=50, unique=True)
    course_department = models.CharField(max_length=150)
    enrollment_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    class Meta:
        db_table = "students"
        indexes = [
            models.Index(fields=["registration_number"], name="students_reg_number_idx"),
            models.Index(fields=["status"], name="students_status_idx"),
            models.Index(fields=["enrollment_date"], name="students_enrollment_date_idx"),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.registration_number})"
