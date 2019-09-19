pipeline {
    agent { label 'tss1'}
    stages {
        stage('Build') {
            steps {
                sh "npm install"
                sh "bower install"
            }
        }
        stage('Package') {
            steps {
                sh "gulp"
            }
        }
    }
}
