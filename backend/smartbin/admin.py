from django.contrib import admin
from .models import SmartBin, WasteReading
# Register your models here.
admin.site.register(SmartBin)
admin.site.register(WasteReading)