pipeline {
    agent any

    stages {
        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning old containers..."
                sh 'docker compose -f docker-compose.ci.yml down || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose -f docker-compose.ci.yml build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker compose -f docker-compose.ci.yml up -d'
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
