from django.shortcuts import render
from .models import SmartBin, WasteReading
from rest_framework import generics
from .serializers import SmartBinSerializer, WasteReadSerializer
# Create your views here.

class createSmartBinView(generics.ListCreateAPIView):
    queryset = SmartBin.objects.all()
    serializer_class = SmartBinSerializer


class createWasteReadingView(generics.ListCreateAPIView):
    queryset = WasteReading.objects.all()
    serializer_class = WasteReadSerializer