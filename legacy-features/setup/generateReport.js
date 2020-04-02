var reporter = require('cucumber-html-reporter')
var package = require('../../package.json')

var options = {
  theme: 'bootstrap',
  jsonFile: './docs/test-report.json',
  output: './docs/index.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  brandTitle: 'Rapport fonctionnel',
  metadata: {
    Version: package.version,
    'Environnement de test': 'STAGING'
  }
}

reporter.generate(options)
