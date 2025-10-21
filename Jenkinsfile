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
          docker build -f Dockerfile.ci -t ${IMAGE_NAME}:ci .
          docker run --rm ${IMAGE_NAME}:ci
        '''
      }
    }
    stage('Deploy (docker compose)') {
      when {
        anyOf {
          branch 'main'
          buildingTag()
        }
      }
      environment {
        IMAGE_NAME = 'web_ban_hang'
        IMAGE_TAG = "${BUILD_NUMBER}"
      }
      steps {
        sh '''
          set -euxo pipefail
          docker compose config
          docker compose up -d --remove-orphans
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
        sh 'docker image prune -f || true'
      }
    }
  }
}