#rebuild the with maven
cd $PROJECT_PATH

yarn install && bower install

cd $DOCKER_UI_PATH
rm -fr ui
mkdir ui
cp -r $PROJECT_PATH/src/* ui/
docker build -f ../DcokerFile -t loginsight-ui .
