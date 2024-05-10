# Generated by Django 4.2.4 on 2023-09-06 21:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='task',
        ),
        migrations.AddField(
            model_name='item',
            name='task',
            field=models.ManyToManyField(related_name='items', to='api.task'),
        ),
    ]
