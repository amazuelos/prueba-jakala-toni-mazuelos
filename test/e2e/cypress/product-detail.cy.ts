/**
 * E2E — Product Detail
 *
 * En Next.js App Router el fetch es server-side (SSR),
 * por lo que no se puede interceptar con cy.intercept.
 * Los tests navegan desde el listado a la primera card
 * y validan contra la API real.
 */
describe('Product Detail', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="product-detail"]').should('exist');
  });

  it('should display the product detail page', () => {
    cy.get('[data-testid="product-detail"]').should('exist');
  });

  it('should display breadcrumbs with Inicio and product name', () => {
    cy.get('[data-testid="breadcrumbs"]').should('exist');
    cy.get('[data-testid="product-detail-back"]').should('have.text', 'Inicio');
    cy.get('[data-testid="breadcrumb-1"]').should('not.be.empty');
  });

  it('should display the product name', () => {
    cy.get('[data-testid="product-name"]').should('not.be.empty');
  });

  it('should display the product binomial name', () => {
    cy.get('[data-testid="product-binomial-name"]').should('not.be.empty');
  });

  it('should display the product price', () => {
    cy.get('[data-testid="product-price"]').should('contain.text', '€');
  });

  it('should display the product image', () => {
    cy.get('[data-testid="product-detail-image"]')
      .should('have.attr', 'alt')
      .and('not.be.empty');
  });

  it('should display the waterings per week', () => {
    cy.get('[data-testid="product-waterings"]').invoke('text').should('match', /\d+/);
  });

  it('should display the fertilizer type', () => {
    cy.get('[data-testid="product-fertilizer"]').should('not.be.empty');
  });

  it('should display the height in cm', () => {
    cy.get('[data-testid="product-height"]').invoke('text').should('match', /\d+/);
  });

  it('should navigate back to the product list when clicking Inicio', () => {
    cy.get('[data-testid="product-detail-back"]').click();
    cy.get('[data-testid="product-list"]').should('exist');
  });
});
