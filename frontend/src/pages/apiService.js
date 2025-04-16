import axios from "axios";

const API_URL = "http://127.0.0.1:80000/api/posts";

export const createPost = async (postData) => {
    try {
        const response = await axios.post(API_URL, postData);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export const getPosts = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/posts');
        return response.data.posts;
        console.log(response.data.posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

export default {
    createPost,
    getPosts
};