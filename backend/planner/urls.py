from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, StudySessionViewSet

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'sessions', StudySessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

from .views import RegisterView

urlpatterns += [
    path('register/', RegisterView.as_view(), name='register'),
]
urlpatterns += router.urls
