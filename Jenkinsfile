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
          sudo chown -R jenkins:jenkins /var/www/todoapp
          cp -r . /var/www/todoapp/
          cd /var/www/todoapp
          npm ci --omit=dev
          sudo systemctl restart todoapp
          sudo systemctl status todoapp --no-pager
        '''
        echo 'Deployment complete'
      }
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
