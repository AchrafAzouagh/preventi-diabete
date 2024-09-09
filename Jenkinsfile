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

                    // Delete existing pod if it exists
                    sh 'kubectl delete pod frontend --ignore-not-found'
                    sh 'kubectl run frontend --image=lonewolfsdocker/frontend'
                    // Optionally wait for pod to be ready
                    sh 'kubectl wait --for=condition=Ready pod/frontend'
                    sh 'kubectl delete service frontend --ignore-not-found'
                    sh 'kubectl expose pod frontend --type=NodePort --port=3000 --name=frontend'

                    // Delete existing pod if it exists
                    sh 'kubectl delete pod backend --ignore-not-found'
                    sh 'kubectl run backend --image=lonewolfsdocker/backend'
                    // Optionally wait for pod to be ready
                    sh 'kubectl wait --for=condition=Ready pod/backend'
                    sh 'kubectl delete service backend --ignore-not-found'
                    sh 'kubectl expose pod backend --type=NodePort --port=5000 --name=backend'

                }
            }
        }

        stage('Port Forwarding') {
            steps {
                script {
                    // Run port forwarding in the background
                    sh './start-port-forwarding.sh'
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
