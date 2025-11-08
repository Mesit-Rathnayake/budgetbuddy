pipeline {
    agent any

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo "🛠 Building backend Docker image..."
                sh 'docker build -t budgetbuddy-backend ./backend'
            }
        }

        stage('Run Backend') {
            steps {
                echo "▶️ Running backend container..."
                sh 'docker compose up -d backend'
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished!"
        }
        failure {
            echo "❌ Pipeline failed."
        }
    }
}
