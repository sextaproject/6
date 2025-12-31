from django.urls import path
from .views import CalculationAPIView

urlpatterns = [
    path('', CalculationAPIView.as_view(), name='Numbers'),
]