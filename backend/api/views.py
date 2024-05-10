from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from django.middleware.csrf import get_token
from datetime import date, timedelta
from django.http import JsonResponse
from rest_framework.decorators import api_view


def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

# manage tasks


# @permission_classes([IsAuthenticatedOrReadOnly])
class ManageTasks(APIView):

    # Handle the GET request to list tasks
    def get(self, request):
        """List tasks."""
        tasks = Task.objects.all().order_by('-start_date')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    # Handle the POST request to create a new task
    def post(self, request, *args, **kwargs):
        # Get the start_date and end_date from the POST data
        start_date = request.data['start_date']
        end_date = request.data['end_date']

        # Check if there's an existing task that conflicts with the given dates
        conflicting_tasks = Task.objects.filter(
            # Task starts before the new task ends and ends after the new task starts
            models.Q(start_date__lte=end_date, end_date__gte=start_date)
        )

        if conflicting_tasks.exists():
            # Return an error response with a meaningful message
            error_message = {
                "message": "Não foi possível criar a Demanda. Conflito de datas!"}
            return Response(error_message, status=status.HTTP_400_BAD_REQUEST)

        task_serializer = TaskSerializer(data=request.data)

        if task_serializer.is_valid():
            task = task_serializer.save()

            # Extract item task data from request and create ItemTask entries
            for item_data in request.data.get('items', []):
                sku = item_data.get('sku')
                # Assuming SKU is provided and is valid
                item = Item.objects.get(sku=sku)
                # Defaulting to 0 if not provided
                total_plan = item_data.get('total_plan', 0)

                # Create the ItemTask instance
                ItemTask.objects.create(
                    task=task, item=item, total_plan=total_plan)

            return Response(task_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)


# manage items
@permission_classes([IsAuthenticatedOrReadOnly])
class ManageItems(APIView):
    # Handle the GET request to list items
    def get(self, request):
        """List items."""
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


# ItemTask
def get_items_for_task(task_id):
    return ItemTask.objects.filter(task__id=task_id)


class ManageItemTask(APIView):

    def get(self, request, task_id):
        items_tasks = get_items_for_task(task_id)

        # Serialize data for response
        data = [{
            'sku': item_task.item.sku,
            'description': item_task.item.description,
            'total_plan': item_task.total_plan,
        } for item_task in items_tasks]

        return Response(data)

    def post(self, request, task_id, *args, **kwargs):
        # Get the items with their new total_plans for the specified task
        items_data = request.data.get('items', {})

        for sku, total_plan in items_data.items():
            try:
                item_task_instance = ItemTask.objects.get(
                    task_id=task_id, item__sku=sku)

                # Convert total_plan to integer before saving
                item_task_instance.total_plan = int(total_plan)
                item_task_instance.save()
            except ItemTask.DoesNotExist:
                print(
                    f"No ItemTask found for task_id: {task_id} and SKU: {sku}")

        return Response({'detail': 'Total plans updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, task_id, item_id):
        try:
            item_task_instance = ItemTask.objects.get(
                task_id=task_id, item__sku=item_id)
            item_task_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ItemTask.DoesNotExist:
            return Response({"error": "Item not found for this task"}, status=status.HTTP_404_NOT_FOUND)
