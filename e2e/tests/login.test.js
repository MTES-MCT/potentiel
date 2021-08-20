import testid from '../helpers/testid'

describe('Login page', () => {

  describe('when wrong credentials are entered', () => {
    
    it('should return an error', async () => {
      cy.visit('/login.html')
      cy.get(testid('email-field')).type('test@test.test')
      cy.get(testid('password-field')).type('mypassword')
      cy.get(testid('submit-button')).click()
      cy.url().should('include', 'login.html')
      cy.get(testid('error-message')).should('contain', 'Identifiant ou mot de passe erroné.')
    })
  });

  describe('when correct credentials are entered', () => {
    it('should redirect to dashboard', async () => {
      cy.visit('/login.html')
      cy.get(testid('email-field')).type('porteur@test.test')
      cy.get(testid('password-field')).type('test')
      cy.get(testid('submit-button')).click()
      cy.url().should('include', 'mes-projets.html')
    })
    
  });

})