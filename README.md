## GraphQL Challenge

1. Add a GraphQL RESTDataSource to interact with https://jsonplaceholder.typicode.com
2. The posts resolver should call the RESTDataSource and return all posts from https://jsonplaceholder.typicode.com/posts/
3. The user resolver should receive a userId from the parent, and use this retrieve the user from https://jsonplaceholder.typicode.com/users/{userId}/
4. The comments resolver receive a postId from the parent, and use this to filter the related comments from https://jsonplaceholder.typicode.com/comments/
5. The user and comments resolver should implement a dataloader, so that the requests are batched into a single API call where possible.
6. The updateUser mutation should use the POST method to update the resource. API documentation can be found at https://jsonplaceholder.typicode.com/guide/
7. Commit the code to a publicly available repository and send us a link. Good luck!

### Resources

RESTDataSource

https://www.apollographql.com/docs/apollo-server/data/fetching-rest/

Dataloader

https://www.npmjs.com/package/dataloader

### Develop

To start the server:

`npm run start`

We recommend using node 16
