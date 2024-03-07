describe('ApiTests', () => {
    it('Create a post on invalid page', () => {
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
            expect(response.status).to.be.equal(401); //404 is in fact
        })
    })

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
            expect(response.status).to.eq(404); //in fact - 200
        })
    })
})