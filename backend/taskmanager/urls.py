"""
URL configuration for taskmanager project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api import views  # Importing the view from the api app

urlpatterns = [
    path('admin/', admin.site.urls),
    # fetch csrf token
    path('csrf/', views.csrf, name='csrf'),

    # tasks urls
    path('task-list/', views.ManageTasks.as_view(), name='task-list'),
    path('delete-task/<int:task_id>/',
         views.ManageTasks.as_view(), name='task-delete'),
    path('update-task/<int:task_id>/',
         views.ManageTasks.as_view(), name='task-update'),
    path('create-task/', views.ManageTasks.as_view(), name='task-create'),

    # items url
    path('item-list/', views.ManageItems.as_view(), name='item-list'),
    path('items-for-task/<int:task_id>/',
         views.ManageItemTask.as_view(), name='items-for-task'),
    path('update-total-plans/<int:task_id>/',
         views.ManageItemTask.as_view(), name='update-total-plans'),
    path('delete-item-task/<int:task_id>/item/<int:item_id>/',
         views.ManageItemTask.as_view(), name='delete-item-task')

]
