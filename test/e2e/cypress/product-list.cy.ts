/**
 * E2E — Product List
 *
 * En Next.js App Router el fetch es server-side (SSR),
 * por lo que no se puede interceptar con cy.intercept.
 * Los tests validan contra la API real.
 */
describe('Product List', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the product list page', () => {
    cy.get('[data-testid="product-list"]').should('exist');
  });

  it('should display the search bar', () => {
    cy.get('[data-testid="search-bar"]').should('exist');
    cy.get('[data-testid="search-input"]').should('exist');
  });

  it('should render product cards from the API', () => {
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });

  it('should display product name on the first card', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-card-name"]').should('not.be.empty');
    });
  });

  it('should display product binomial name on the first card', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-card-binomial-name"]').should('not.be.empty');
    });
  });

  it('should display product price on the first card', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-card-price"]').should('contain.text', '€');
    });
  });

  it('should display product image on the first card', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="product-card-image"]').should('have.attr', 'alt').and('not.be.empty');
    });
  });

  it('should filter products when searching', () => {
    cy.get('[data-testid="product-card"]').then(($cards) => {
      const totalCards = $cards.length;
      cy.get('[data-testid="search-input"]').type('Orquídea');
      cy.get('[data-testid="product-card"]').should('have.length.lessThan', totalCards);
      cy.get('[data-testid="product-card-name"]').first().should('contain.text', 'Orquídea');
    });
  });

  it('should navigate to product detail when clicking a card', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('include', '/product/');
    cy.get('[data-testid="product-detail"]').should('exist');
  });

  it('should show a no-results message when search has no matches', () => {
    cy.get('[data-testid="search-input"]').type('xyznoexiste');
    cy.get('[data-testid="product-card"]').should('not.exist');
    cy.get('[data-testid="no-results"]').should('exist');
    cy.get('[data-testid="no-results"]').should('contain.text', 'No se encontraron productos');
  });
});
