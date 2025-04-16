import React, { useEffect, useState } from 'react';
// @ts-ignore - ignore typing if apiService.js is JS
import { getPosts } from './apiService';


type Post = {
    postTitle: string;
    user: string;
    content: string;
    date: string;
};

const DisplayAllPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts(); // should return just the array of posts
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <button onClick={() => window.location.href = '/signin-with-google'}>Go to My Page</button>
            <h1>All Posts</h1>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post, index) => (
                        <li key={index} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                            <h2>{post.postTitle}</h2>
                            <p><strong>User:</strong> {post.user}</p>
                            <p><strong>Content:</strong> {post.content}</p>
                            <p><strong>Date:</strong> {post.date}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default DisplayAllPosts;
