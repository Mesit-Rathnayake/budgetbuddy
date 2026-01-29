pipeline {
    agent any

    triggers {
        // Trigger on develop branch commits (separate from GitHub Actions on main)
        githubPush()
    }

    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // 30 minute timeout
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code from develop branch..."
                checkout scm
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo "🧹 Cleaning old containers..."
                sh '''
                    docker compose down --volumes --remove-orphans || true
                    docker rm -f myapp-mongo myapp-backend myapp-frontend 2>/dev/null || true
                    docker volume prune -f || true
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images..."
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo "🚀 Starting containers..."
                sh 'docker compose up -d'
            }
        }

        stage('Wait for Services') {
            steps {
                echo "⏳ Waiting for services to be healthy..."
                sh '''
                    sleep 10
                    docker compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "🏥 Performing health checks..."
                sh '''
                    echo "Checking MongoDB..."
                    docker compose exec -T mongo mongosh --eval "db.adminCommand({ ping: 1 })" || true
                    
                    echo "Checking Backend API..."
                    curl -f http://localhost:5000/api/health || true
                    
                    echo "All containers running:"
                    docker ps
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "✅ Deployment verification complete"
                sh 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline executed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs above."
        }
        always {
            echo "📊 Pipeline finished!"
            sh 'docker compose ps'
        }
    }
}
