/// <reference types="Cypress" />

describe('My second Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('login.html')

    cy.get('input[name=email]').type('test@test.com')
    cy.get('input[name=password]').type('test')

    cy.get('button[name=submit]').click()

    cy.get('[data-testid^=projectList-list] tr').each($row => {
      const nomProjectElem = $row.find(
        '[data-testid=projectList-item-nomProjet]'
      )
      if (nomProjectElem) {
        cy.log('Nom du projet ', nomProjectElem.first().text())
      } else {
        cy.log('Ne peux pas trouver le nom du projet')
      }
    })

    cy.get('[data-testid^=projectList-list] tr')
      .first()
      .get('.list--action-trigger')
      .first()
      .focus()

    // cy.request({
    //   method: 'POST',
    //   url: 'login', // baseUrl will be prepended to this url
    //   body: {
    //     email: 'test@test.com',
    //     password: 'test'
    //   }
    // })

    // cy.visit('admin/dashboard.html')
  })
})
