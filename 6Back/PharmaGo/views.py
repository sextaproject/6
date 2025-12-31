from rest_framework import generics, filters

from .models import Drug
from .serializers import DrugSerializer


class DrugListView(generics.ListAPIView):
    serializer_class = DrugSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "category", "adult_dose", "pediatric_dose"]

    def get_queryset(self):
        queryset = Drug.objects.all()
        audience = self.request.query_params.get("audience")

        if audience == "pediatric":
            queryset = queryset.filter(is_pediatric=True)
        elif audience == "adult":
            queryset = queryset.filter(is_pediatric=False)

        return queryset.order_by("name")