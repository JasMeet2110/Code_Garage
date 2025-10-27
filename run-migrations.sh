echo "Applying SQL migrations to MySQL container..."
for file in $(ls ./database/migrations/*.sql | sort); do
  echo " Running $file ..."
  docker exec -i code_garage_mysql mysql -u garage_user -pgarage_password code_garage_db < $file
done
echo "All migrations applied."