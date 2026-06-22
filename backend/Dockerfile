# Use an official lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy just the requirements first (optimizes Docker caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Flask defaults to port 5000, expose it to the container network
EXPOSE 5000

# Run Flask. The --host=0.0.0.0 is CRITICAL so it listens on all interfaces inside Docker
CMD ["python", "app.py", "--host=0.0.0.0"]