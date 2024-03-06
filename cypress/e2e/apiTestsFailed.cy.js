describe('ApiTests', () => {

  it('Create a post', () => {
    cy.log('Try to create post on invalid page');
    cy.request({
      method: 'POST',
      url: "/664/posts",
      form: true,
      body: "create post on invalid page",
      failOnStatusCode: false

    }).then(response => {
      cy.log('Verify status code is 401');
      expect(response.status).to.be.equal(401);
    })
  })

  it('Create post with adding access token in header', () => {
    const newPost = {
      title: 'New Post Title',
      body: 'This is the body of the new post.',
      userId: 1 // Assuming userId 1 exists in the system
    };

    const accessToken = 'your_access_token_here'; // Replace with your actual access token

    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/664/posts',
      body: newPost,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${accessToken}`
      },

    }).then((response) => {
      // Verify status code
      expect(response.status).to.eq(201);

      // Verify post is created
      expect(response.body.title).to.eq(newPost.title);
      expect(response.body.body).to.eq(newPost.body);
      expect(response.body.userId).to.eq(newPost.userId);
    });
  })


  it('Update non-existing entity', () => {
    cy.log('Register a new user');
    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/users',
      body: {
        username: 'testuser1111',
        email: 'testuser111@example.com'
      }
    }).then((createUserResponse) => {
      cy.log('Verify user is created with status code 201');
      expect(createUserResponse.status).to.eq(201);

      cy.log('Update post by user');
      const updatedPost = {
      title: 'Updated Post Title',
      body: 'This is the updated body of the post.',
      userId: createUserResponse.body.id
    };
    cy.log('Request updated not existing post in body');
    cy.request({
      method: 'PUT',
      url: 'https://jsonplaceholder.typicode.com/posts/101',
      body: updatedPost,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code is 404');
      expect(response.status).to.eq(404);
  })
    })
  })

  it('Create post entity and update the created entity', () => {
    cy.log('Register a new user');
    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/users',
      body: {
        username: 'testuser11112',
        email: 'testuser112@example.com'
      }
    }).then((createUserResponse) => {
      cy.log('Verify user is created with status code 201');
      expect(createUserResponse.status).to.eq(201);

      cy.log('Create post by user');
    const newPost = {
      title: 'New Post Title',
      body: 'This is the body of the new post.',
      userId: createUserResponse.body.id
    };
    cy.log('Request creating post');
    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: newPost,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((createResponse) => {
      cy.log('Verify post is created with status code 201 and data is correct');
      expect(createResponse.status).to.eq(201);

      expect(createResponse.body.title).to.eq(newPost.title);
      expect(createResponse.body.body).to.eq(newPost.body);
      expect(createResponse.body.userId).to.eq(newPost.userId);

      cy.log('Update created post');
      const updatedPost = {
        id: createResponse.body.id,
        title: 'Updated Post Title',
        body: 'This is the updated body of the post.'
      };

      cy.request({
        method: 'PUT',
        url: `https://jsonplaceholder.typicode.com/posts/${createResponse.body.id}`,
        body: updatedPost,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((updateResponse) => {
        cy.log('Verify created post response code is 200 and data is updated');
        expect(updateResponse.status).to.eq(200);

        expect(updateResponse.body.title).to.eq(updatedPost.title);
        expect(updateResponse.body.body).to.eq(updatedPost.body);
        expect(updateResponse.body.userId).to.eq(updatedPost.userId);
      });
    });
    });
  })

  it('Delete non-existing post entity', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://jsonplaceholder.typicode.com/posts/1014343',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  })

  it('Create post entity, update the created entity, and delete the entity', () => {
    // Create a new post
    const newPost = {
      title: 'New Post Title',
      body: 'This is the body of the new post.',
      userId: 1 // Assuming userId 1 exists in the system
    };

    cy.request({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: newPost,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((createResponse) => {
      // Verify status code for post creation
      expect(createResponse.status).to.eq(201);

      // Verify post is created
      expect(createResponse.body.title).to.eq(newPost.title);
      expect(createResponse.body.body).to.eq(newPost.body);
      expect(createResponse.body.userId).to.eq(newPost.userId);

      // Update the created post
      const updatedPost = {
        id: createResponse.body.id,
        title: 'Updated Post Title',
        body: 'This is the updated body of the post.',
        userId: 1 // Assuming userId 1 exists in the system
      };

      cy.request({
        method: 'PUT',
        url: `https://jsonplaceholder.typicode.com/posts/${createResponse.body.id}`,
        body: updatedPost,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }).then((updateResponse) => {
        // Verify status code for post update
        expect(updateResponse.status).to.eq(200);

        // Verify post is updated
        expect(updateResponse.body.title).to.eq(updatedPost.title);
        expect(updateResponse.body.body).to.eq(updatedPost.body);
        expect(updateResponse.body.userId).to.eq(updatedPost.userId);

        // Delete the updated post
        cy.request({
          method: 'DELETE',
          url: `https://jsonplaceholder.typicode.com/posts/${createResponse.body.id}`
        }).then((deleteResponse) => {
          // Verify status code for post deletion
          expect(deleteResponse.status).to.eq(200);

          // Try to get the deleted post
          cy.request({
            method: 'GET',
            url: `https://jsonplaceholder.typicode.com/posts/${createResponse.body.id}`,
            failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx status code
          }).then((getResponse) => {
            // Verify status code for getting the deleted post
            expect(getResponse.status).to.eq(404); // Assuming 404 is returned for non-existing entity
          });
        });
      });
    });
  })

})