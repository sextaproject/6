from rest_framework import serializers
from .models import Drug

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = '__all__' # Sends everything (name, doses, safety categories, etc.)