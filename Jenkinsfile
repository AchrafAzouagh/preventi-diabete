pipeline {
    agent any
    triggers {
        githubPush()  // Automatically triggers on GitHub push
    }
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/AchrafAzouagh/preventi-diabete.git' // Replace with your Git repository URL
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build frontend and backend images
                    sh 'docker-compose build'
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    // Run containers
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {

                    // Ensure kubectl is configured for Minikube
                    sh 'sudo kubectl config use-context minikube'

                    // Apply Kubernetes manifests
                    sh 'sudo kubectl apply -f k8s-manifests/backend-deployment.yaml'
                    sh 'sudo kubectl apply -f k8s-manifests/frontend-deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
