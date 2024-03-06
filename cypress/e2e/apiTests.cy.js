describe('ApiTests', () => {
  it.only('Get all posts', () => {
    cy.request({
      method: 'GET',
      url: "/posts",
      form: true,
      body: "get post"

    }).then(response => {
      expect(response.status).to.be.equal(200);
      expect(response.headers['content-type']).to.include('application/json');
    })
  })

  it('Get only first 10 posts', () => {
  })

  it('Get posts with id = 55 and id = 60', () => {
  })

  it('Create a post', () => {
  })

  it('Create post with adding access token in header', () => {
  })

  it('Create post entity and verify that the entity is created', () => {
  })

  it('Update non-existing entity', () => {
  })

  it('Create post entity and update the created entity', () => {
  })

  it('Delete non-existing post entity', () => {
  })

  it('Create post entity, update the created entity, and delete the entity', () => {
  })

})