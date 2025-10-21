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
    REGISTRY     = "${env.DOCKER_REGISTRY ?: ''}"
    REGISTRY_USER= "${env.DOCKER_REGISTRY_USER ?: ''}"
    REGISTRY_PASS= "${env.DOCKER_REGISTRY_PASS ?: ''}"
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
    stage('Push Image (optional)') {
      when {
        expression { return env.REGISTRY?.trim() && env.REGISTRY_USER?.trim() && env.REGISTRY_PASS?.trim() }
      }
      steps {
        sh '''
          set -euxo pipefail
          echo "$REGISTRY_PASS" | docker login "$REGISTRY" -u "$REGISTRY_USER" --password-stdin
          docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
          docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
          docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
          docker push ${REGISTRY}/${IMAGE_NAME}:latest
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
      steps {
        sh '''
          set -euxo pipefail
          docker compose config
          # Helper to wait for container health
          wait_health() {
            for i in $(seq 1 60); do
              health=$(docker inspect --format '{{json .State.Health.Status}}' web_ban_hang || echo '"starting"')
              echo "Container health: $health"
              if [ "$health" = '"healthy"' ]; then
                return 0
              fi
              sleep 5
            done
            return 1
          }

          mkdir -p .deploy

          echo "Deploying tag: ${IMAGE_TAG}"
          docker compose up -d --remove-orphans || true

          if wait_health; then
            echo "${IMAGE_TAG}" > .deploy/last_successful_tag
            echo "Deployment healthy on tag ${IMAGE_TAG}"
          else
            echo "Deployment with tag ${IMAGE_TAG} unhealthy. Attempting rollback..."
            if [ -f .deploy/last_successful_tag ]; then
              PREV_TAG=$(cat .deploy/last_successful_tag)
              if [ -n "$PREV_TAG" ]; then
                echo "Rolling back to tag: $PREV_TAG"
                # Ensure previous image exists locally or pull from registry if configured
                if ! docker image inspect ${IMAGE_NAME}:${PREV_TAG} >/dev/null 2>&1; then
                  if [ -n "${REGISTRY}" ]; then
                    docker pull ${REGISTRY}/${IMAGE_NAME}:${PREV_TAG}
                    docker tag ${REGISTRY}/${IMAGE_NAME}:${PREV_TAG} ${IMAGE_NAME}:${PREV_TAG}
                  else
                    echo "Previous image ${IMAGE_NAME}:${PREV_TAG} not found locally and no REGISTRY set to pull from."
                    exit 1
                  fi
                fi

                IMAGE_TAG="$PREV_TAG" docker compose up -d --remove-orphans || true
                if wait_health; then
                  echo "Rollback successful. Running on tag ${PREV_TAG}"
                else
                  echo "Rollback to ${PREV_TAG} failed."
                  exit 1
                fi
              else
                echo "Previous tag file is empty. Cannot rollback."
                exit 1
              fi
            else
              echo "No previous successful tag file (.deploy/last_successful_tag) to rollback."
              exit 1
            fi
          fi
        '''
      }
    }
    stage('Debug env') {
      steps {
        sh 'env | sort | grep -E "BRANCH|GIT_BRANCH|TAG|CHANGE" || true'
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