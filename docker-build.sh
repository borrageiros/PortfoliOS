#!/bin/bash

CONTAINER_NAME=portfoliOS
IMAGE_NAME=portfolios:latest

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
docker run -d \
    --name $CONTAINER_NAME \
    --env-file .env \
    -p 4173:4173 \
    $IMAGE_NAME
