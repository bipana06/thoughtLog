import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/posts";

// Function to create a new post
export const createPost = async (postData) => {
    try {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('userId', postData.userId);
        formData.append('date', postData.date);
        
        console.log(formData);
        const response = await axios.post('http://127.0.0.1:8000/api/posts', postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
        );
        window.alert("Post created successfully");
        return response.data;

    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

// Function to get all posts
export const getallPosts = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/posts');
        return response.data.posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

// function to get all the posts from a user
export const getUserPosts = async (userId) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/posts/${userId}`);
        // console.log(response.data.posts);
        return response.data.posts;
    }
    catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
}

// function to edit post
export const editPost = async (postId, postData) => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/posts/${postId}`, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        window.alert("Post updated successfully");
        return response.data;
    }
    catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

// function to delete post
export const deletePost = async (postId) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data);
        window.alert("Post deleted successfully");
        return response.data;
    }
    catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}

// Function to start Google sign-in (redirects to backend)
export const googleSignIn = () => {
    window.location.href = 'http://127.0.0.1:8000/login/google';
};

// Function to sign up a new user
export const signup = async (signupData) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/signup', signupData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default {
    createPost,
    getallPosts,
    getUserPosts,
    editPost,
    deletePost,
    googleSignIn,
    signup
};