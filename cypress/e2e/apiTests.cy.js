import {faker} from '@faker-js/faker'
let userLogin = faker.internet.email('Jeanne', 'Doe');
let userPassword = faker.internet.password();
let postCreateTitle= faker.word.noun(5);
let postCreateBody= faker.random.words({ min: 3, max: 5 });
let postUpdateTitle= faker.word.noun(8);
let postUpdateBody= faker.random.words({ min: 4, max: 6 });

let notExistingPostId = 3543;
let userDataBody = {email: userLogin, password: userPassword};
let postCreateDataBody= {title: postCreateTitle, body: postCreateBody};
let postUpdateDataBody= {title: postUpdateTitle, body: postUpdateBody};
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

  it('Create a post', () => { /
    let token = '';

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })


    cy.log('Try to create post on /664/posts page');
    cy.request({
      method: 'POST',
      url: "/664/posts",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postCreateDataBody,
      failOnStatusCode: false

    }).then(response => {
      cy.log('Verify status code is 401');
      expect(response.status).to.be.equal(401);
    })
  })

  it('Create post with adding access token in header', () => {
    let token = '';

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

    cy.log('Create new post using access token in header')
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postCreateDataBody

    }).then(response => {
      cy.log('Verify status code is 201 and post is created')
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    })
  })

  it('Create post entity and verify that the entity is created', () => {
    let token = '';

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

    cy.log('Create post by created json post in body');
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postCreateDataBody

    }).then((response) => {
      cy.log('Verify status code is 201 and post is created with correct data');
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(postCreateDataBody.title);
      expect(response.body.body).to.eq(postCreateDataBody.body);
    });
  })

  it('Update non-existing entity', () => {
    let token = '';

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

    cy.log('Request update of not existing post in body');
    cy.request({
      method: 'PUT',
      url: `/posts/${notExistingPostId}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postUpdateDataBody,
      failOnStatusCode: false

    }).then((response) => {
      cy.log('Verify status code is 404 and page is not found');
      expect(response.status).to.eq(404);
    })
  })

  it('Create post entity and update the created entity', () => {
    let token;
    let postId;

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

    cy.log('Create new post using access token in header')
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postCreateDataBody

    }).then(response => {
      cy.log('Verify status code is 201 and post is created')
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');

      cy.log('Get new post id');
      postId = response.body.id;

      cy.log('Update created post');
      cy.request({
        method: 'PUT',
        url: `/posts/${postId}`,
        body: postUpdateDataBody,
        failOnStatusCode: false

      }).then(response => {
        cy.log('Verify status code is 200 and post is updated');
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(postUpdateDataBody.title);
        expect(response.body.body).to.eq(postUpdateDataBody.body);
      });
    })
  });

  it('Delete non-existing post entity', () => {
    let token = '';

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

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
    let token;
    let postId;

    it('Create a new user', () => {
      cy.log('Register new user');
      cy.request({
        method: 'POST',
        url: '/register',
        body: userDataBody

      }).then(response => {
        cy.log('Verify user is created');
        expect(response.status).to.eq(201);

        cy.log('Get user access token');
        token = response.body.token;
      })
    })

    cy.log('Create new post using access token in header')
    cy.request({
      method: 'POST',
      url: '/posts',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: postCreateDataBody

    }).then(response => {
      cy.log('Verify status code is 201 and post is created')
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');

      cy.log('Get new post id');
      postId = response.body.id;

      cy.log('Update created post');
      cy.request({
        method: 'PUT',
        url: `/posts/${postId}`,
        body: postUpdateDataBody,
        failOnStatusCode: false

      }).then(response => {
        cy.log('Verify status code is 200 and post is updated');
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(postUpdateDataBody.title);
        expect(response.body.body).to.eq(postUpdateDataBody.body);
      });

      cy.log('Delete created post');
      cy.request({
        method: 'DELETE',
        url: `/posts/${postId}`

      }).then(response => {
        cy.log('Verify status code is 200 and post is deleted');
        expect(response.status).to.eq(200);
      });

      cy.log('Go to post URL and check that page is not exist');
      cy.request({
        method: 'GET',
        url: `/posts/${postId}`,
        body: "get post with deleted id",
        failOnStatusCode: false

      }).then(response => {
        cy.log('Verify status code is 404 and post is not exist');
        expect(response.status).to.eq(404);
      });
    })
  });
})