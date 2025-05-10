#!/bin/bash

CONTAINER_NAME=portfoliOS
IMAGE_NAME=portfolios:latest
CREATE_VOLUME=false
VOLUME_PATH=""

# Process arguments
if [ "$1" = "--volume" ] || [ "$1" = "-v" ]; then
    CREATE_VOLUME=true
    # If there is a second argument, use it as the volume path
    if [ -n "$2" ]; then
        VOLUME_PATH="$2"
    else
        # Use the current directory by default
        VOLUME_PATH="$(pwd)/data"
        # Create the directory if it doesn't exist
        mkdir -p "$VOLUME_PATH"
    fi
    echo "🗄️ A volume will be created with the path: $VOLUME_PATH"
fi

echo "🔍 Checking if container '$CONTAINER_NAME' is running..."
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping the container..."
    docker stop $CONTAINER_NAME
fi

echo "🗑️ Removing container if it exists..."
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    docker rm $CONTAINER_NAME
fi

echo "🔨 Building new image..."
docker build -t $IMAGE_NAME .

echo "📦 Loading environment variables from .env..."
export $(grep -v '^#' .env | xargs)

echo "🚀 Running the container..."
# Check if a volume should be created
if [ "$CREATE_VOLUME" = true ]; then
    docker run -d \
        --name $CONTAINER_NAME \
        --env-file .env \
        -p 4173:3000 \
        -v "$VOLUME_PATH:/app/static/data" \
        $IMAGE_NAME
else
    docker run -d \
        --name $CONTAINER_NAME \
        --env-file .env \
        -p 4173:3000 \
        $IMAGE_NAME
fi

echo "✅ Container started correctly"
