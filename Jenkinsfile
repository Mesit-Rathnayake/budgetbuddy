pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                sh 'docker compose build --no-cache'
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Running containers..."
                // Run in detached mode with forced recreation
                sh 'docker compose up -d --force-recreate'
            }
        }

        stage('Wait for Services') {
            steps {
                echo "⏳ Waiting for containers to become healthy..."
                // Wait for MongoDB
                sh '''
                until [ "$(docker inspect -f '{{.State.Health.Status}}' myapp-mongo)" = "healthy" ]; do
                  echo "Waiting for MongoDB..."
                  sleep 5
                done
                '''

                // Wait for Backend
                sh '''
                until [ "$(docker inspect -f '{{.State.Health.Status}}' myapp-backend)" = "healthy" ]; do
                  echo "Waiting for Backend..."
                  sleep 5
                done
                '''
            }
        }

        stage('Check Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished!"
        }
    }
}
