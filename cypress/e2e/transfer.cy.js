describe('Wallet QA Lab - transfert E2E', () => {
  beforeEach(() => {
    cy.visit('/index.html');
    cy.contains('Wallets initialisés avec succès.').should('be.visible');
  });

  it('affiche les soldes initiaux', () => {
    cy.get('#wallet1-balance').should('have.text', '1000');
    cy.get('#wallet2-balance').should('have.text', '300');
  });

  it('effectue un transfert réussi', () => {
    cy.get('#amount').clear().type('200');
    cy.get('#transfer-btn').click();

    cy.get('#message').should('contain', 'Transfert réussi');
    cy.get('#wallet1-balance').should('have.text', '800');
    cy.get('#wallet2-balance').should('have.text', '500');
    cy.get('#transactions-list li').should('have.length', 1);
    cy.get('#transactions-list li').first().should('contain', 'SUCCESS');
  });

  it('rejette un montant négatif', () => {
    cy.get('#amount').clear().type('-50');
    cy.get('#transfer-btn').click();

    cy.get('#message').should('contain', 'amount must be greater than 0');
    cy.get('#wallet1-balance').should('have.text', '1000');
    cy.get('#wallet2-balance').should('have.text', '300');
    cy.get('#transactions-list li').should('have.length', 0);
  });
});