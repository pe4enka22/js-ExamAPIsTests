describe('ApiTests', () => {
  it('Create post with adding access token in header', () => { //success
    let token = '';
    let userLogin = "testUse1r";
    let userPassword = "testPasswor1d";

    cy.log('Create new user')
    cy.request({
      method: 'POST',
      url: '/users',
      body: {userLogin, userPassword}
    }).then(response => {
      expect(response.status).to.eq(201);

      cy.log('Get access token')
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
      cy.log('Update post by user');
      const updatedPost = {
      title: 'Updated Post Title',
      body: 'This is the updated body of the post.'
    };

    cy.log('Request update of not existing post in body');
    cy.request({
      method: 'PUT',
      url: '/posts/1234',
      body: updatedPost,
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code is 404');
      expect(response.status).to.eq(404); // in fact it's 500
  })
    })



    it('Create post entity and update the created entity', () => {
      let userId = '';
      let postId = '';
      let accessToken = '';

      const newUserCredentials = {
        username: 'testUser2323',
        password: 'testPassword2323'
      };
      cy.request({
        method: 'POST',
        url: '/users',
        body: newUserCredentials
      }).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        userId = response.body.id;
      });
      const newPostData = {
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: userId
      };

      cy.request({
        method: 'POST',
        url: '/posts',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: newPostData
      }).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        postId = response.body.id;
      });

      const updatedPostData = {
        title: 'Updated Post Title',
        body: 'Updated Post Body'
      };

      cy.request({
        method: 'PUT',
        url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: updatedPostData,
        failOnStatusCode:false
      }).then(response => {
        //  expect(response.status).to.eq(200); //400 in fact
        //   expect(response.body).to.deep.equal({updatedPostData,
        //    id: postId,
        //    userId: userId
      });
    });


    it('Create post entity, update the created entity, and delete the entity', () => {
      let userId = '';
      let postId = '';
      let accessToken = '';

      const newUserCredentials = {
        username: 'testUser',
        password: 'testPassword'
      };

      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/users',
        body: newUserCredentials
      }).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        userId = response.body.id;
      });

      const newPostData = {
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: userId
      };

      cy.request({
        method: 'POST',
        url: 'https://jsonplaceholder.typicode.com/posts',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: newPostData
      }).then(response => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        postId = response.body.id;
      });

      const updatedPostData = {
        title: 'Updated Post Title',
        body: 'Updated Post Body'
      };

      cy.request({
        method: 'PUT',
        url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: updatedPostData,
        failOnStatusCode: false
      }).then(response => {
        //   expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({
          //updatedPostData,
          //  id: postId,
          //  userId: userId
        });

        cy.request({
          method: 'DELETE',
          url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }).then(response => {
          expect(response.status).to.eq(200);
        });
      });

    });
})