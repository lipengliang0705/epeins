docker  rm $(docker ps -a|grep tss|awk '{print $1 }') --force
