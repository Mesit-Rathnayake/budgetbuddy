pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from Git..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                // Force rebuild to include latest changes
                sh 'docker compose build --no-cache'
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Running containers..."
                // Force recreate even if the image has changed
                sh 'docker compose up -d --force-recreate'
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
