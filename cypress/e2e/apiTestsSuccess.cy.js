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

    it('Create post entity and verify that the entity is created', () => {
        cy.log('Add json post data for request');

        cy.log('Create post by created json post in body');
        cy.request({
            method: 'POST',
            url: '/posts',
            title: 'TestTitle',
            body: 'Test body'

        }).then((response) => {
            cy.log('Verify status code is 201 and post is created with correct data');
            expect(response.status).to.eq(201);
            expect(response.body.title).to.eq('TestTitle');
            expect(response.body.body).to.eq('Test body');
        });
    })
})