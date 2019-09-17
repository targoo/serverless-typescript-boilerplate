#!/usr/bin/env bash

kill `cat .offline.pid`
rm .offline.pid

# kill Dynamodb local not really a good way to kill the process
kill $(lsof -t -i:8000)
