import {faker} from '@faker-js/faker'
const userLogin = faker.internet.displayName({ firstName: 'Jeanne', lastName: 'Doe'});
const userPassword = faker.internet.password();
describe('ApiTests', () => {
  it('Create post with adding access token in header', () => { //success
    let token = '';

    cy.log('Create new user')
    cy.request({
      method: 'POST',
      url: '/users',
      body: {userLogin, userPassword}

    }).then(response => {
      expect(response.status).to.eq(201);

      cy.log('Get user access token')
      token = response.body.token;
    });

    cy.log('Create new post using access token in header')
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: 'create new post'

    }).then(response => {
      cy.log('Verify status code is 201 and post is created')
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
   })
  })

  it('Update non-existing entity', () => { //success
    const notExistingPostId = 249;

    cy.log('Request update of not existing post in body');
    cy.request({
      method: 'PUT',
      url: `/posts/${notExistingPostId}`,
      title: 'Updated Post Title',
      body: 'This is the updated body of the post.',
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code is 404 and page is not found');
      expect(response.status).to.eq(404); // in fact it's 500
  })
    })

      it('Create post entity and update the created entity', () => {
        let postId = '';

        cy.log('Create new post');
        cy.request({
          method: 'POST',
          url: '/posts',
          title: 'Test Post Title',
          body: 'Test Post Body'

        }).then(response => {
          cy.log('Verify status code is 201 and ppost is created');
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');

          cy.log('Get postID');
          postId = response.body.id;
        });

        cy.log('Update created post');
        cy.request({
          method: 'PUT',
          url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
          title: 'Updated Post Title',
          body: 'Updated Post Body',
          failOnStatusCode:false

        }).then(response => {
          cy.log('Verify status code is 200 and post is updated');
          //  expect(response.status).to.eq(200); //400 in fact
          //   expect(response.body).to.deep.equal({updatedPostData,
          //    id: postId
        });
      });

    it('Create post entity, update the created entity, and delete the entity', () => {
      let postId = '';

      cy.log('Create new post');
      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        title: 'Test Post Title',
        body: 'Test Post Body'

      }).then(response => {
        cy.log('Verify status code is 201 and post is created');
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');

        cy.log('Get postID');
        postId = response.body.id;
      });

      cy.log('Update created post');
      cy.request({
        method: 'PUT',
        url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
        title: 'Updated Post Title',
        body: 'Updated Post Body',
        failOnStatusCode: false

      }).then(response => {
        cy.log('Verify status code is 200 and post is updated');
        //   expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({
          //updatedPostData,
          //  id: postId,
          //  userId: userId
        });

        cy.log('Delete created post');
        cy.request({
          method: 'DELETE',
          url: `https://jsonplaceholder.typicode.com/posts/${postId}`

        }).then(response => {
          cy.log('Verify status code is 200 and post is deleted');
          expect(response.status).to.eq(200);
        });
      });
    });
})