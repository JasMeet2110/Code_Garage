#!/bin/bash

echo "🚀 Applying SQL migrations to MySQL container..."

# Ensure container is running
if ! docker ps | grep -q "code_garage_mysql"; then
  echo "❌ MySQL container 'code_garage_mysql' is not running. Please start it first."
  exit 1
fi

# Loop through all .sql files in order
for file in $(ls ./database/migrations/*.sql | sort); do
  echo "📄 Running migration: $file ..."
  docker exec -i code_garage_mysql mysql -ugarage_user -pgarage_password code_garage_db < "$file"

  # Check exit code
  if [ $? -ne 0 ]; then
    echo "❌ Failed while running $file"
    exit 1
  fi
done

echo "✅ All migrations applied successfully!"


