#!/bin/bash

echo "Removing executing containers..."
if [ "$( docker container inspect -f '{{.State.Running}}' catedrabob-spc19-web )" == "true" ]; then
    echo "Removing container catedrabob-spc19-web ..."
    docker rm -f catedrabob-spc19-web
fi

echo "Building image..."
docker build -t catedrabob-spc19-web .


echo "Starting catedrabob-spc19-web container..."
docker run -d \
    --name catedrabob-spc19-web \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 8000:8000 \
    -e CHOKIDAR_USEPOLLING=true \
    --network spc19-test-network_quorum-dev-quickstart \
    catedrabob-spc19-web
