pipeline {
    agent any

    stages {
        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning old containers..."
                sh 'docker compose down || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠 Building Docker images..."
                // Use host network to fix npm network issues
                sh 'docker compose build --no-cache --build-arg NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ --network=host'
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Running containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Check Running Containers') {
            steps {
                echo "📦 Checking running containers..."
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
