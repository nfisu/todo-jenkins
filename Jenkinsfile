pipeline {
  agent any
  tools {
    nodejs 'NodeJS-18'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
        echo 'Code checked out successfully'
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
        echo 'Dependencies installed'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm run lint'
        echo 'Linting passed'
      }
    }
    stage('Security Scan') {
      steps {
        sh 'npm audit --audit-level=high'
        echo 'Security scan passed'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
        echo 'All tests passed'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
        echo 'Build complete'
      }
    }
    stage('Deploy') {
      steps {
        sh '''
          # Copy the latest code from Jenkins workspace to the app directory
          sudo cp -r /var/lib/jenkins/workspace/todo-pipeline/. /var/www/todoapp/

          # Give jenkins ownership so npm ci can run without permission errors
          sudo chown -R jenkins:jenkins /var/www/todoapp

          # Move into the app directory
          cd /var/www/todoapp

          # Install only production dependencies (no dev tools needed on live server)
          sudo npm ci --omit=dev

          # Return ownership to ubuntu for normal operation
          sudo chown -R ubuntu:ubuntu /var/www/todoapp

          # Restart the app service to load the new code
          sudo systemctl restart todoapp

          # Wait 5 seconds to give the app time to fully start up
          sleep 5

          # Curl the /health endpoint and capture only the HTTP status code
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)

          # Print the status code so it appears in the Jenkins logs
          echo "Health check returned HTTP status: $HTTP_STATUS"

          # If the status is anything other than 200, fail the pipeline
          if [ "$HTTP_STATUS" != "200" ]; then
            echo "HEALTH CHECK FAILED! App returned HTTP $HTTP_STATUS instead of 200"
            echo "The deployment has been marked as failed"
            exit 1
          fi

          # If we reach here, the health check passed
          echo "Health check passed -- app is healthy and running"
        '''
        echo 'Deployment complete'
      }
    }
  post {
    always {
      echo 'Pipeline finished'
    }
    success {
      echo 'All stages passed -- app deployed successfully'
    }
    failure {
      echo 'Pipeline failed -- check the stage logs above for details'
    }
  }
}
