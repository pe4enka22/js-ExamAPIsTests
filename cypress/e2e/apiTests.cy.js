import {faker} from '@faker-js/faker'
const userLogin = faker.internet.userName('Jeanne', 'Doe');
const userPassword = faker.internet.password();

describe('ApiTests', () => {
  it('Get all posts', () => {
    cy.log('Get all posts');
    cy.request({
      method: 'GET',
      url: "/posts",
      body: "get post"

    }).then(response => {
      cy.log('Verify status code is 200 and content type is application/json');
      expect(response.status).to.be.equal(200);
      expect(response.headers['content-type']).to.include('application/json');
    })
  })

  it('Get only first 10 posts', () => {
    cy.log('Get first 10 posts');
    cy.request({
      method: 'GET',
      url: "/posts?_limit=10",
      body: "get fist 10 posts"

    }).then(response => {
      cy.log('Verify status code is 200 and post quantity is 10');
      expect(response.status).to.be.equal(200);
      expect(response.body.length).to.eq(10);
    })
  })

  it('Get posts with id = 55 and id = 60', () => {
    cy.log('Get posts with 55 and 60 ids');
    cy.request({
      method: 'GET',
      url: "/posts?id=55&id=60",
      body: "get posts with ids"

    }).then(response => {
      cy.log('Verify status code is 200 and posts quantity is 2');
      expect(response.status).to.be.equal(200);
      expect(response.body.length).to.eq(2);

      cy.log('Verify posts ids are 55 and 60');
      const expectedIds = [55, 60];
      const returnedIds = response.body.map(post => post.id);
      expect(returnedIds).to.deep.eq(expectedIds);
    })
  })

  it('Create a post', () => {
    const newPostId = 1147;

    cy.log('Try to create post on /664/posts page');
    cy.request({
      method: 'POST',
      url: "/664/posts",
      title: 'TestTitle',
      body: 'Test body',
      id: newPostId,
      failOnStatusCode: false

    }).then(response => {
      cy.log('Verify status code is 401');
      expect(response.status).to.be.equal(401);
    })
  })

  it('Create post with adding access token in header', () => {
    let token = '';

    cy.log('Create new user')
    cy.request({
      method: 'POST',
      url: '/users',
      body: {
        userLogin,
        userPassword
      }

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

  it('Create post entity and verify that the entity is created', () => {
    cy.log('Add json post data for request');
    const createPost = {
      title: 'TestTitle',
      body: 'Test body'
    };
    cy.log('Create post by created json post in body');
    cy.request({
      method: 'POST',
      url: '/posts',
      body: createPost

    }).then((response) => {
      cy.log('Verify status code is 201 and post is created with correct data');
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq('TestTitle');
      expect(response.body.body).to.eq('Test body');
    });
  })

  it('Update non-existing entity', () => {
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
      expect(response.status).to.eq(404);
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
      cy.log('Verify status code is 201 and post is created');
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');

      cy.log('Get postID');
      postId = response.body.id;
    });

    cy.log('Update created post');
    cy.request({
      method: 'PUT',
      url: `/posts/${postId}`,
      title: 'Updated Post Title',
      body: 'Updated Post Body',
      failOnStatusCode: false

    }).then(response => {
      cy.log('Verify status code is 200 and post is updated');
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.equal('Updated Post Body');
      expect(response.body.title).to.deep.equal('Updated Post Title');
    });
  });

  it('Delete non-existing post entity', () => {
    const notExistingPostId = 247;

    cy.log('Check that post is not exist');
    cy.request({
      method: 'GET',
      url: `/posts/${notExistingPostId}`,
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code is 404 and page not found');
      expect(response.status).to.eq(404);
    })

    cy.log('Check that not existed post can not be deleted');
    cy.request({
      method: 'DELETE',
      url: `/posts/${notExistingPostId}`,
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code on deletion is 404');
      expect(response.status).to.eq(404);
    })
  })

  it('Create post entity, update the created entity, and delete the entity', () => {
    let postId = '';

    cy.log('Create new post');
    cy.request({
      method: 'POST',
      url: '/posts',
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
      url: `/posts/${postId}`,
      title: 'Updated Post Title',
      body: 'Updated Post Body',
      failOnStatusCode: false

    }).then(response => {
      cy.log('Verify status code is 200 and post is updated');
      expect(response.body).to.deep.equal({});

      cy.log('Delete created post');
      cy.request({
        method: 'DELETE',
        url: `/posts/${postId}`

      }).then(response => {
        cy.log('Verify status code is 200 and post is deleted');
        expect(response.status).to.eq(200);
      });
    });
  });
})