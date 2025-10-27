#!/usr/bin/env bash
set -e
docker build -t fiverr-auto .
docker run -p 8000:8000 fiverr-auto
