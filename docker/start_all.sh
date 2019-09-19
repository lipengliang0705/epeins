docker network rm loginsight
docker network create loginsight
#mysql
docker run -itd --name mysql --net loginsight \
-e MYSQL_ROOT_PASSWORD=loginsight \
-e MYSQL_PASSWORD=tss \
-e MYSQL_USER=tss \
-e MYSQL_DATABASE=tss_log_insight_new_new \
-p 3306:3306 \
mysql:5.7 \
--character-set-server=utf8mb4 \
--collation-server=utf8mb4_unicode_ci

#elastic
sudo sysctl -w vm.max_map_count=262144
docker run -itd --name elastic --net loginsight -p 9200:9200 -p 9300:9300 elastic

#server
docker run -itd --name loginsight-server --net loginsight -p 8080:8080 loginsight
#ui
docker run -itd --name loginsight-ui --net loginsight  -p 80:80 loginsight-ui

