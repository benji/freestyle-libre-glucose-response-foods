#!/bin/sh
set -e

cd "`dirname "$0"`"

python -m http.server 5001
