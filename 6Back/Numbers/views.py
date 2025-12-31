from django.shortcuts import render
from rest_framework import generics, filters

from django.views import View
from django.http import HttpResponse


class CalculationAPIView(View):
     async def get(self, request, *args, **kwargs):
        # Perform io-blocking view logic using await, sleep for example.
        return HttpResponse("Hello async world!")
