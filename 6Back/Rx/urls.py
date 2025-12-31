from django.urls import path
from . import views

urlpatterns = [
    # This creates the endpoint: /api/rx/analyze/
    path('analyze/', views.analyze_xray, name='analyze_xray'),
]