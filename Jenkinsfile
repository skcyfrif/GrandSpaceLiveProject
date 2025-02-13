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

        stage('Cleanup Old Containers and Images') {
            steps {
                script {
                    echo "Stopping and removing old containers..."
                    sh '''
                        docker-compose -f docker-compose.yml down || true
                        docker rm -f $(docker ps -a -q --filter "name=grandspace") || true
                    '''

                    echo "Removing old Docker images..."
                    sh '''
                        docker rmi -f $(docker images -q $DOCKER_IMAGE) || true
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building the Docker image..."
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    echo "Creating Docker network..."
                    sh 'docker network create grandspace-network || true'

                    echo "Starting Docker containers..."
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }
}