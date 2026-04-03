from django.db import models

from core.base_models import BaseModel
from employees.models import Employee
from subjects.models import Subject


class Question(BaseModel):
    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    ANSWER_CHOICES = [
        ("A", "Option A"),
        ("B", "Option B"),
        ("C", "Option C"),
        ("D", "Option D"),
    ]

    subject = models.ForeignKey(
        Subject,
        on_delete=models.PROTECT,
        related_name="questions",
    )
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1, choices=ANSWER_CHOICES)
    marks = models.PositiveIntegerField()
    difficulty_level = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="questions_created",
    )

    class Meta:
        db_table = "questions"
        indexes = [
            models.Index(fields=["subject"], name="questions_subject_idx"),
            models.Index(fields=["difficulty_level"], name="questions_difficulty_idx"),
            models.Index(fields=["created_by"], name="questions_created_by_idx"),
            models.Index(fields=["created_at"], name="questions_created_at_idx"),
        ]

    def __str__(self):
        summary = (self.question_text or "").strip()
        if len(summary) > 50:
            summary = f"{summary[:47]}..."
        return f"{self.subject.subject_name}: {summary}".strip()
