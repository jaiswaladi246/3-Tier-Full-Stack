pipeline {
  agent any
  
  tools {
    nodejs 'node21'
  }

  environment {
    SCANNER_HOME = tool 'sonar-scanner'
  }
   
  stages {
    stage('Git Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/ranjitrupnawar/3-Tier-Full-Stack.git'
      }
    }

    stage('Install dependency package') {
      steps {
        sh 'npm install'
      }
    }

    stage('Trivy FS Scan') {
      steps {
        sh 'trivy fs --format table -o fs-report.html .'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
          sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectKey=campground -Dsonar.projectName=campground -Dsonar.login=$SONAR_TOKEN"
        }
      }
    }

    stage('Docker build and tag') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
            sh "docker build -t ranjitrupnawar/camp:latest ."
          }
        }
      }
    } 

    stage('Trivy Image scan') {
      steps {
        sh 'trivy image --format table -o image-report.html ranjitrupnawar/camp:latest'
      }
    }

    stage('Docker push') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
            sh "docker push ranjitrupnawar/camp:latest"
          }
        }
      }
    }

    stage('Docker deployment') {
      steps {
        script {
          withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
            sh "docker run -d -p 3000:3000 ranjitrupnawar/camp:latest"
          }
        }
      }
    }
  }

  
}
