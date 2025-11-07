pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Mesit-Rathnayake/budgetbuddy.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "${DOCKER_COMPOSE} build"
            }
        }

        stage('Run Containers') {
            steps {
                sh "${DOCKER_COMPOSE} up -d"
            }
        }

        stage('Check Running Containers') {
            steps {
                sh "docker ps"
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up containers...'
            sh "${DOCKER_COMPOSE} down"
        }
    }
}
