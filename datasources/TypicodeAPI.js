import { RESTDataSource } from '@apollo/datasource-rest';
import DataLoader from 'dataloader';

export class TypicodeAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://jsonplaceholder.typicode.com/';
    }
    
    async getAllPosts() {
      return this.get('posts');
    }
    
    async getUser(userId) {
      return this.get(`users/${userId}`);
    }

    // use dataloader to avoid making the same request all over again.
    getUsers = new DataLoader(async (userIds) => {
      return userIds.map((userId) => this.getUser(userId));
    });
    
    async getAllComments() {
      return this.get('comments');
    }

    // Use dataloader to batch
    getCommentsForPosts = new DataLoader(async (postIds) => {
      const comments = await this.getAllComments();

      return postIds.map((postId) => {
        return comments.filter((comment) => comment.postId == postId);
      })
    })

    async updatePost(postData) {
      return this.post('posts', postData);
    }
}
