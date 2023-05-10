describe("sign in page", () => {
  it.only("the features on the home page are correct", () => {
    cy.visit("http://localhost:3000");

    cy.get(".signin").within(() => {
      cy.get(".button").contains("Sign in with Google");
      cy.get("[action$=credentials]").contains("Sign in with Guest Password");
    });
  });
});
