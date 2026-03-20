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

        stage('Docker Hub Login') {
            steps {
                echo "🔐 Logging in to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }

                echo "🐳 Building backend image (${env.IMAGE_TAG})..."
                sh "docker build -t mesith30/budgetbuddy-backend:${env.IMAGE_TAG} -t mesith30/budgetbuddy-backend:latest ./back"

                echo "🐳 Building frontend image (${env.IMAGE_TAG})..."
                sh "docker build -t mesith30/budgetbuddy-frontend:${env.IMAGE_TAG} -t mesith30/budgetbuddy-frontend:latest ./front"
            }
        }

        stage('Push Docker Images') {
            steps {
                echo "📤 Pushing images to Docker Hub..."
                                sh '''
                                        set -e
                                        retry_push() {
                                            local image="$1"
                                            local attempts=3
                                            local delay=10
                                            for i in $(seq 1 $attempts); do
                                                echo "Pushing $image (attempt $i/$attempts)..."
                                                if docker push "$image"; then
                                                    return 0
                                                fi
                                                sleep "$delay"
                                            done
                                            return 1
                                        }

                                        retry_push "mesith30/budgetbuddy-backend:${IMAGE_TAG}"
                                        retry_push "mesith30/budgetbuddy-backend:latest"
                                        retry_push "mesith30/budgetbuddy-frontend:${IMAGE_TAG}"
                                        retry_push "mesith30/budgetbuddy-frontend:latest"
                                '''
            }
        }

        stage('Deploy via Ansible') {
            steps {
                echo "🚀 Deploying to EC2 via Ansible..."
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'EC2_KEY_FILE', usernameVariable: 'EC2_USER')]) {
                    sh '''
                        ANSIBLE_PRIVATE_KEY_FILE="$EC2_KEY_FILE" \
                        ansible-playbook -i ansible/inventory.ini ansible/deploy.yml \
                        -e "ansible_ssh_private_key_file=$EC2_KEY_FILE image_tag=$IMAGE_TAG"
                    '''
                }
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
        }
    }
}
