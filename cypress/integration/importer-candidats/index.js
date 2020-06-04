/// <reference types="cypress" />
import {
  Before,
  Given,
  When,
  And,
  Then,
} from 'cypress-cucumber-preprocessor/steps'
import testid from '../../helpers/testid'

Given("je me rends sur la page d'import de candidats", () => {
  cy.visit('/admin/importer-candidats.html')
})

When('je selectionne le fichier {string}', async function (filename) {
  // Don't ask me why base64 works...
  cy.fixture(filename, 'base64').then((fileContent) => {
    cy.get(testid('candidats-field')).upload({
      fileContent,
      fileName: 'candidats.csv',
      mimeType: 'text/plain',
      encoding: 'base64',
    })
  })
})

When('je valide le formulaire', () => {
  cy.get(testid('submit-button')).click()
})

Then('je suis dirigé vers la page qui liste les projets à notifier', () => {
  cy.url().should('include', '/admin/notifier-candidats.html')
})

Then('je suis dirigé vers la page qui liste les projets', () => {
  cy.url().should('include', '/admin/dashboard.html')
})

Then('on me notifie la réussite par {string}', (successMessage) => {
  cy.get(testid('success-message')).should('contain', successMessage)
})

Then(
  'je trouve bien le projet {string} dans la liste des projets',
  (projectName) => {
    cy.get(testid('projectList-item-nomProjet')).should('contain', projectName)
  }
)

Then(
  'le projet {string} a bien une section details qui contient un champ {string} qui a la valeur {string}',
  (projectName, fieldName, fieldValue) => {
    cy.getProject(projectName).then((project) => {
      expect(project).to.not.be.undefined
      expect(project).to.have.property('details')
      expect(project.details).to.have.property(fieldName)
      expect(project.details[fieldName]).to.equal(fieldValue)
    })
  }
)

Then(
  'le projet {string} a bien une section details qui ne contient pas de champ {string}',
  (projectName, fieldName) => {
    cy.getProject(projectName).then((project) => {
      expect(project).to.not.be.undefined
      expect(project).to.have.property('details')
      expect(project.details).to.not.have.property(fieldName)
    })
  }
)

Then(
  'le projet {string} a toujours ses informations de garanties financieres',
  (projectName) => {
    cy.get('@initialProjects').then((initialProjects) => {
      cy.getProject(projectName).then((project) => {
        cy.log(project)
        expect(project).to.not.be.undefined
        expect(project.garantiesFinancieresDate.toString()).to.equal(
          initialProjects[0].garantiesFinancieresDate
        )
        expect(project.garantiesFinancieresFile).to.equal(
          initialProjects[0].garantiesFinancieresFile
        )
        expect(project.garantiesFinancieresSubmittedBy).to.equal(
          initialProjects[0].garantiesFinancieresSubmittedBy
        )
        expect(project.garantiesFinancieresSubmittedOn.toString()).to.equal(
          initialProjects[0].garantiesFinancieresSubmittedOn
        )
      })
    })
  }
)

Given('le projet suivant', async function (dataTable) {
  cy.wrap(dataTable.hashes()).as('initialProjects')
  cy.insertProjectsForUser(dataTable.hashes())
})

Then("la liste ne contient qu'un seul projet", () => {
  cy.get(testid('projectList-item')).should('have.length', 1)
})
