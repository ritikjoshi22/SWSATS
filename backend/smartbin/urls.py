from django.urls import path
from .views import createSmartBinView, createWasteReadingView

urlpatterns = [
    path('smartbin/', createSmartBinView.as_view(), name="smartbin"),
    path('wasteread/', createWasteReadingView.as_view(), name="wasteread"),
]
