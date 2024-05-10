from django.template.defaultfilters import date
from rest_framework import serializers
from .models import *


class TaskSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(
        format='%d/%m/%Y', input_formats=['%d/%m/%Y', 'iso-8601'])
    end_date = serializers.DateField(
        format='%d/%m/%Y', input_formats=['%d/%m/%Y', 'iso-8601'])
    item_count = serializers.SerializerMethodField()
    total_plan_sum = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_status(self, obj):
        return obj.status

    def get_item_count(self, task):
        return task.items.count()

    def get_total_plan_sum(self, task):
        total = ItemTask.objects.filter(task=task).aggregate(
            sum=models.Sum('total_plan'))['sum'] or 0
        return '{:,.0f}'.format(total).replace(",", ".")


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
