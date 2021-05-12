#!/bin/bash

echo "Removing executing containers..."
if [ "$( docker container inspect -f '{{.State.Running}}' catedrabob-spc19-web )" == "true" ]; then
    echo "Removing container catedrabob-spc19-web ..."
    docker rm -f catedrabob-spc19-web
fi
