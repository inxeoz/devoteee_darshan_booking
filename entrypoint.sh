#!/bin/sh

# Generate env.js from environment variables
echo "window.__ENV__ = {" > /app/build/env.js

# Loop through all environment variables
for var in $(env | grep -E '^[A-Z_][A-Z0-9_]*=' | cut -d'=' -f1); do
  value=$(printenv "$var" | sed 's/"/\\"/g')
  echo "  \"$var\": \"$value\"," >> /app/build/env.js
done

echo "};" >> /app/build/env.js

# Start the static server
serve -s build -l 3000