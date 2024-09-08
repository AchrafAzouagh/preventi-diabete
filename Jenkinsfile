pipeline {
    agent any

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

        stage('Run Tests') {
            steps {
                script {
                    // Add any tests you want to run
                    sh 'docker exec preventi-diabete-frontend-1 npm test'
                    sh 'docker exec preventi-diabete-backend-1 pytest'
                }
            }
        }
    }

    post {
        always {
            // Cleanup after the pipeline run
            script {
                sh 'docker-compose down'
            }
        }
    }
}
