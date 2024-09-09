pipeline {
    agent any
    triggers {
        githubPush()  // Automatically triggers on GitHub push
    }
    environment {
        MINIKUBE_RUNNING = sh(script: 'minikube status | grep "host" | grep "Running"', returnStatus: true) == 0
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

        stage('Start Minikube') {
            when {
                expression { !env.MINIKUBE_RUNNING }
            }
            steps {
                script {
                    sh 'minikube start --driver=docker'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply configurations
                    sh 'kubectl apply -f backend-deployment.yaml'
                    sh 'kubectl apply -f backend-service.yaml'
                }
            }
        }

        stage('Port Forwarding') {
            steps {
                script {
                    // Run port forwarding in the background
                    sh 'kubectl port-forward svc/backend 5000:5000 &'
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
