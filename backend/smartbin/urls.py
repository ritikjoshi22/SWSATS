from django.urls import path
from .views import createSmartBinView, createWasteReadingView, LatestWasteReadingPerBinView

urlpatterns = [
    path('smartbin/', createSmartBinView.as_view(), name="smartbin"), #--> bin add ra herna ko lagi
    path('wasteread/', createWasteReadingView.as_view(), name="wasteread"),  #--> waste details haru add garna ko lagi matra
    path('latest-readings/', LatestWasteReadingPerBinView.as_view(), name='latest-readings'),  #--> each lastest bin details read garna ko lagi only
]
