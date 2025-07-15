from django.db import models
from django.contrib.auth.models import User

class Lesson(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    created_at = models.DateField(auto_now_add=True)
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.title} - {self.user.username}"

class StudySession(models.Model):
    SESSION_TYPES = (
        ('study', 'مطالعه'),
        ('review', 'مرور'),
    )

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='sessions')
    session_type = models.CharField(max_length=10, choices=SESSION_TYPES)
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.lesson.title} - {self.session_type} on {self.date}"
