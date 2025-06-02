import React, { useEffect, useState } from 'react';
// @ts-ignore - ignore typing if apiService.js is JS
import { getUserPosts, createPost, editPost, deletePost } from './apiService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [editingPost, setEditingPost] = useState<any | null>(null); // State for the post being edited
    const [formData, setFormData] = useState({ postTitle: '', content: '' }); // Form data for editing
    const [user, setUser] = useState<{ email: string; name: string; username?: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('thoughtlog_jwt');
        if (!token) {
            navigate('/signin-with-google');
            return;
        }
        // Get user info from backend
        axios.get('http://127.0.0.1:8000/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setUser(res.data);
            // Fetch posts for this user
            axios.get(`http://127.0.0.1:8000/api/posts/${res.data.username || res.data.email}`)
                .then(postsRes => setPosts(postsRes.data.posts))
                .catch(() => setPosts([]));
        })
        .catch(() => {
            localStorage.removeItem('thoughtlog_jwt');
            navigate('/signin-with-google');
        });
    }, [navigate]);

    const handleCreatePost = async () => {
        navigate('/new-post-form');
    };

    const handleEditClick = (post: any) => {
        setEditingPost(post); // Set the post being edited
        setFormData({ postTitle: post.postTitle, content: post.content }); // Pre-fill the form with post data
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;

        try {
            await editPost(editingPost._id, formData); // Call the editPost API
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === editingPost._id ? { ...post, ...formData } : post
                )
            );
            setEditingPost(null); // Close the edit form
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            await deletePost(postId); // Call the deletePost API
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)); // Remove the deleted post from the state
            window.alert('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div>
            <h1 className='text-black'>User Posts</h1>
            <button onClick={handleCreatePost} style={{ marginBottom: '1rem' }}>
                Create New Post
            </button>
            <ul>
                {posts.map((post, index) => (
                    <React.Fragment key={index}>
                        <li
                            style={{
                                marginBottom: '2rem',
                                borderBottom: '1px solid #ccc',
                                paddingBottom: '1rem',
                            }}
                        >
                            <h2>{post.postTitle}</h2>
                            <p>
                                <strong>User:</strong> {user?.username || user?.email}
                            </p>
                            <p>
                                <strong>Content:</strong> {post.content}
                            </p>
                            <p>
                                <strong>Date:</strong> {post.date}
                            </p>
                            <button
                                onClick={() => handleEditClick(post)}
                                style={{ marginRight: '1rem' }}
                            >
                                Edit
                            </button>
                            <button onClick={() => handleDelete(post._id)}>Delete</button>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
            {editingPost && (
                <form onSubmit={handleEditSubmit} style={{ marginTop: '2rem' }}>
                    <h2>Edit Post</h2>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="postTitle"
                            value={formData.postTitle}
                            onChange={handleFormChange}
                        />
                    </label>
                    <br />
                    <label>
                        Content:
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleFormChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Save Changes</button>
                    <button
                        type="button"
                        onClick={() => setEditingPost(null)}
                        style={{ marginLeft: '1rem' }}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default MyPage;