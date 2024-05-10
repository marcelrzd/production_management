from django.db import models
from django.db.models import Q


class Task(models.Model):
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    @property
    def status(self):
        from datetime import date
        today = date.today()
        if self.start_date <= today <= self.end_date:
            return 'EM ANDAMENTO'
        elif today < self.start_date:
            return 'PLANEJAMENTO'
        else:
            return 'CONCLUÍDO'

    def __str__(self):
        return 'from '+str(self.start_date) + ' to '+str(self.end_date)


class Item(models.Model):
    sku = models.CharField(max_length=10, primary_key=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    tasks = models.ManyToManyField(
        Task, through='ItemTask', related_name="items")

    def __str__(self):
        return str(self.sku) + ' - ' + self.description


class ItemTask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    total_plan = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('task', 'item')

    def __str__(self):
        return 'sku: '+str(self.item.sku) + ' - from '+str(self.task.start_date) + ' to '+str(self.task.end_date)+' - Total Plan: '+str(self.total_plan)
