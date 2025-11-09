from .models import SmartBin, WasteReading
from rest_framework import serializers

class SmartBinSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartBin
        fields = "__all__"

class WasteReadSerializer(serializers.ModelSerializer):
    fill_status = serializers.SerializerMethodField()

    class Meta:
        model = WasteReading
        fields = ['id', 'bin', 'metal', 'plastic', 'bio', 'fill_level',
                  'fill_status', 'battery_level', 'timestamp']
        
    def get_fill_status(self, obj):
        return obj.fill_status