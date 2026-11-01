#!/bin/sh
cd "$(dirname "$0")" || exit 1
printf 'Open http://127.0.0.1:8000 in your browser. Keep this window open.\n'
python3 -m http.server 8000 --bind 127.0.0.1
