const sonarqubeScanner = require('sonarqube-scanner');
const path = require('path');  
const argv = require('yargs').argv;
const userName = (argv.user) ? argv.user : require('git-user-name')().replace(' ', '.');
const repo = (argv.repo) ? argv.repo : __dirname.split(path.sep).pop();
const properties = require('properties-reader')('./sonar-project.properties');

/* 
  All options except the sonar.projectKey parameter will be 
  pulled from the sonar-project.properties file.

  The sonar.projectKey property is being overriden for each
  user or via the command line parameters for the Jenkins
  task name.
 */

sonarqubeScanner({
  serverUrl : properties.get('sonar.host.url'),
  options : {
    'sonar.projectKey': userName + ':' + repo
  }
}, () => {});
