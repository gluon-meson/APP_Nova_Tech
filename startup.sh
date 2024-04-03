#!/bin/sh
echo 'starting...'

docker-compose down --rmi local
docker-compose up -d
