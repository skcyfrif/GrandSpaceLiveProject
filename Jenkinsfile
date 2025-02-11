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
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image from Dockerfile
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }
        stage('Run Docker Compose') {
            steps {
                script {
                    // Run the Docker containers using docker-compose
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }

    }
}
