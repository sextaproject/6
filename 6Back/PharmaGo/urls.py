from django.urls import path
from .views import DrugListView

urlpatterns = [
    path('drugs/', DrugListView.as_view(), name='drug-list'),
]