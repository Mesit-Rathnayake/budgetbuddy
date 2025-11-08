pipeline {
    agent any

    environment {
        NPM_REGISTRY = "https://registry.npmjs.org/"
    }

    stages {
        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning old containers..."
                // Stop and remove old containers, ignore errors
                sh 'docker compose down || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                // Build images with no-cache and npm registry set
                sh """
                    docker compose build --no-cache \
                    --build-arg NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
                """
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Starting containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                echo "📊 Checking running containers..."
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished!"
        }
        success {
            echo "🎉 All stages completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check logs for errors."
        }
    }
}
