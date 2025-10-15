pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }


  environment {
    IMAGE_NAME   = 'web_ban_hang'
    IMAGE_TAG    = "${env.BUILD_NUMBER}"
    COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker image') {
      steps {
        sh '''
          set -euxo pipefail
          docker version
          docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
        '''
      }
    }

    stage('Test') {
      steps {
        sh '''
          set -euxo pipefail
          # Build a CI image that includes devDependencies and run tests inside it
          docker build -f Dockerfile.ci -t ${IMAGE_NAME}:ci .
          docker run --rm ${IMAGE_NAME}:ci
        '''
      }
    }

    stage('Deploy (docker compose)') {
      when { branch 'main' }
      steps {
        sh '''
          set -euxo pipefail
          # Ensure compose v2 is available
          docker compose version
          # Restart service with latest build
          docker compose -f ${COMPOSE_FILE} down || true
          docker compose -f ${COMPOSE_FILE} up -d --build
        '''
      }
    }
  }

  post {
    success {
      echo "Build ${env.BUILD_NUMBER} succeeded"
    }
    failure {
      echo "Build ${env.BUILD_NUMBER} failed"
    }
    always {
      script {
        // Clean up dangling images to save space
        sh 'docker image prune -f || true'
      }
    }
  }
}
