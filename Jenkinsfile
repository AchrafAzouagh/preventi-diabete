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

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply configurations
                    sh 'kubectl apply -f ./k8s-manifests/backend-deployment.yaml'
                    sh 'kubectl apply -f ./k8s-manifests/backend-service.yaml'
                }
            }
        }

        stage('Port Forwarding') {
            steps {
                script {
                    // Run port forwarding in the background
                    sh 'kubectl port-forward svc/backend-service 5000:5000 &'
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
