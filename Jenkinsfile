pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    timeout(time: 30, unit: 'MINUTES')
  }

  triggers {
    // Requires GitHub plugin; enables push-based builds via webhook
    githubPush()
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
          # Run tests using a clean Node image to ensure devDependencies are present
          docker run --rm \
            -v "$PWD":/app -w /app \
            node:18 bash -lc "npm ci && npm test"
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
