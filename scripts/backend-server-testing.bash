#!/bin/bash

curl -X POST http://localhost:3000/api/fetch-web-content \
     -H "Content-Type: application/json" \
     -d '{"url": "https://mitzvah.capital"}'