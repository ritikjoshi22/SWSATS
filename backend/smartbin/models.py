from django.db import models

# Create your models here.
class SmartBin(models.Model):
    bin_id = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default="active")
    installed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bin {self.bin_id} - {self.area}"


class WasteReading(models.Model):
    bin = models.ForeignKey(SmartBin, on_delete=models.CASCADE, related_name='readings')
    metal = models.FloatField(default=0)
    plastic = models.FloatField(default=0)
    bio = models.FloatField(default=0)
    fill_level = models.FloatField(default=0)
    battery_level = models.FloatField(default=0, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    @property
    def fill_status(self):
        if self.fill_level < 60:
            return "Good"
        elif 60 <= self.fill_level < 85:
            return "Warning"
        else:
            return "Critical"
