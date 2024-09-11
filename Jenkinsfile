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

        stage('Use Minikube Docker Environment') {
            steps {
                script {
                    // Set up environment to use Minikube's Docker daemon
                    sh 'eval $(minikube docker-env)'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build frontend and backend images using Minikube's Docker daemon
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply Kubernetes configurations using local Docker images
                    sh 'kubectl delete pod frontend --ignore-not-found'
                    sh 'kubectl run frontend --image=frontend:latest'
                    // Optionally wait for pod to be ready
                    sh 'kubectl wait --for=condition=Ready pod/frontend'
                    sh 'kubectl delete service frontend --ignore-not-found'
                    sh 'kubectl expose pod frontend --type=NodePort --port=3000 --name=frontend'

                    sh 'kubectl delete pod backend --ignore-not-found'
                    sh 'kubectl run backend --image=backend:latest'
                    // Optionally wait for pod to be ready
                    sh 'kubectl wait --for=condition=Ready pod/backend'
                    sh 'kubectl delete service backend --ignore-not-found'
                    sh 'kubectl expose pod backend --type=NodePort --port=5000 --name=backend'
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
                    export JENKINS_NODE_COOKIE=dontKillMe
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
