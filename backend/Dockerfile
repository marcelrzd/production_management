# Use an official Python runtime as the base image
FROM python:3.9

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV DJANGO_ALLOWED_HOSTS='*'

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory into the container at /app
COPY . /app/

# Install Django and any other dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Specify the command to run on container start
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
