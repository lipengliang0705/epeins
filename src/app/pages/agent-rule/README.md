 # 安装docker& docker-compose 环境
 sudo rpm -ivh --nodeps  audit-libs-2.8.1-3.el7_5.1.x86_64.rpm
 sudo rpm -ivh --nodeps  audit-2.8.1-3.el7_5.1.x86_64.rpm
 sudo rpm -ivh --nodeps  audit-libs-python-2.8.1-3.el7_5.1.x86_64.rpm
 sudo rpm -ivh --nodeps  checkpolicy-2.5-6.el7.x86_64.rpm
 sudo rpm -ivh --nodeps  libcgroup-0.41-15.el7.x86_64.rpm
 sudo rpm -ivh --nodeps  libsemanage-python-2.5-11.el7.x86_64.rpm
 sudo rpm -ivh --nodeps  python-IPy-0.75-6.el7.noarch.rpm
 sudo rpm -ivh --nodeps  setools-libs-3.3.8-2.el7.x86_64.rpm
 sudo rpm -ivh --nodeps  policycoreutils-python-2.5-22.el7.x86_64.rpm
 sudo rpm -ivh --nodeps  container-selinux-2.68-1.el7.noarch.rpm
 sudo rpm -ivh --nodeps  docker-ce-18.06.1.ce-3.el7.x86_64.rpm
 #   docker-compose 为可执行文件
 mv docker-compose-Linux-x86_64 /usr/bin


# 创建loginsight 网络
 docker network create loginsight
# 导入kafka镜像
 docker load < kafka.tar
# 导入mysql镜像
sudo  docker load < mysql.tar
# 导入nginx镜像
sudo  docker load < nginx.tar
# 导入tssloginsight-server镜像
sudo  docker load < tssloginsight-server.tar
# 导入tssloginsight-ui镜像
 docker load < tssloginsight-ui.tar
# 导入elasticsearch镜像
sudo  docker load < elasticsearch.tar
 # 导入spark镜像
sudo   docker load < tssloginsight-spark.tar
 # 导入elastalert镜像
sudo  docker load < elastalert.tar
# 给mysql重命名
sudo  docker tag 702fb0b7837f mysql:5.7.20
# 防止es启动报错
 sudo sysctl -w vm.max_map_count=262144
 启动所有服务
 docker-compose up

 # 同级目录下remove_all_containers.sh 是删除本次应用下所有容器，建议每次重启时执行


# kafka 查看topic数据
 docker exec -it docker_tssloginsight-kafka_1 /opt/kafka_2.11-0.10.1.0/bin/kafka-console-consumer.sh --topic mot --zookeeper 127.0.0.1
#kafka 查看topic列表
                                                                       bin/kafka-topics.sh --list --zookeeper 127.0.0.1            
