# urls.py
from django.urls import path
from .views import WastePredictView

urlpatterns = [
    path('predict/', WastePredictView.as_view(), name='waste-predict'),
]
