import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore - ignore typing if apiService.js is JS
import { createPost } from './apiService'; // Adjust the import based on your project structure
import { jwtDecode } from 'jwt-decode';

const NewPostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('thoughtlog_jwt');
        if (!token) {
            navigate('/signin-with-google');
            return;
        }
        try {
            const decoded: any = jwtDecode(token);
            setUserEmail(decoded.email);
        } catch {
            localStorage.removeItem('thoughtlog_jwt');
            navigate('/signin-with-google');
        }
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to handle form submission, e.g., API call
        const postData = {
            postTitle: title,
            user: userEmail,
            content: content,
            date: new Date().toISOString(),
        };
        try{
            console.log('Post data:', postData);
            const response = createPost(postData);
            window.alert('Post created: ' + response);
            // Optionally, you can reset the form fields after submission
            
            setTitle('');
            setContent('');
            // Optionally, redirect to another page or show a success message
        
        }
        catch (error) {
            console.error('Error creating post:', error);
        }
        

        
    };

    return (
        <div>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        placeholder='Enter post title'
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        placeholder='Enter post content'
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default NewPostForm;