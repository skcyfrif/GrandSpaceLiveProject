pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'grandspacelive:latest' // Define your Docker image name
        MYSQL_HOST = 'grandspace-mysql-db'  // MySQL service name in docker-compose
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    echo "Cloning repository..."
                    checkout scm
                }
            }
        }
        stage('Build Application') {
            steps {
                script {
                    echo "Building the JAR..."
                    sh 'mvn clean package -DskipTests'  // Ensure JAR is built
                }
            }
        }
        stage('Remove Old Docker Image') {
            steps {
                script {
                    echo "Removing old Docker image..."
                    sh "docker images -q $DOCKER_IMAGE | xargs -r docker rmi -f"
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building new Docker image..."
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }
        stage('Run Docker Compose') {
            steps {
                script {
                    sh 'docker network create grandspace-network || true'
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }
}
