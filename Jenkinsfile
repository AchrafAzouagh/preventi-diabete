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

                stage('Wait for Services') {
            steps {
                script {
                    // Wait for services to be available
                    sleep(time: 30, unit: 'SECONDS')
                }
            }
        }

        stage('Stop Old Port Forwarding') {
            steps {
                script {
                    // Kill old kubectl port-forwarding processes
                    sh 'pkill -f "kubectl port-forward" || true'
                }
            }
        }

        stage('Start Port Forwarding') {
            steps {
                script {
                    // Run port forwarding in the background
                    sh '''
                    kubectl port-forward svc/backend 5000:5000 --address 0.0.0.0 > backend-port-forward.log 2>&1 &
                    kubectl port-forward svc/frontend 3000:3000 --address 0.0.0.0 > frontend-port-forward.log 2>&1 &
                    '''
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