// import React, { useEffect, useState } from 'react';
// // @ts-ignore - ignore typing if apiService.js is JS
// import { getUserPosts, createPost, editPost } from './apiService';
// import { useNavigate } from 'react-router-dom';

// const MyPage: React.FC = () => {
//     const [posts, setPosts] = useState<any[]>([]);
//     const [editingPost, setEditingPost] = useState<any | null>(null); // State for the post being edited
//     const [formData, setFormData] = useState({ postTitle: '', content: '' }); // Form data for editing
//     const navigate = useNavigate();
//     const userId = 'test_user2'; // Hardcoded user ID


//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const userPosts = await getUserPosts(userId);
//                 console.log('User Posts:', userPosts);
//                 setPosts(userPosts);
//             } catch (error) {
//                 console.error('Error fetching user posts:', error);
//             }
//         };

//         fetchPosts();
//     }, []);

//     const handleCreatePost = async () => {
//            navigate('/new-post-form');
//     };

//     const handleEditClick = (post: any) => {
//         setEditingPost(post); // Set the post being edited
//         setFormData({ postTitle: post.postTitle, content: post.content }); // Pre-fill the form with post data
//     };

//     const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleEditSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!editingPost) return;

//         try {
//             await editPost(editingPost._id, formData); // Call the editPost API
//             setPosts((prevPosts) =>
//                 prevPosts.map((post) =>
//                     post._id === editingPost._id ? { ...post, ...formData } : post
//                 )
//             );
//             setEditingPost(null); // Close the edit form
//         } catch (error) {
//             console.error('Error updating post:', error);
//         }
//     };

//     const handleDelete = (postId: string) => {
//         // Add logic to handle deleting a post
//         console.log('Delete post:', postId);
//     };

//     return (
//         <div>
//             <h1>User Posts</h1>
//             <button onClick={handleCreatePost} style={{ marginBottom: "1rem" }}>
//                 Create New Post
//             </button>
//             <ul>
//                 {posts.map((post, index) => (
//                     <React.Fragment key={index}>
//                         <li style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
//                             <h2>{post.postTitle}</h2>
//                             <p><strong>User:</strong> {post.user}</p>
//                             <p><strong>Content:</strong> {post.content}</p>
//                             <p><strong>Date:</strong> {post.date}</p>
//                             <button onClick={() => handleEditClick(post)} style={{ marginRight: '1rem' }}>
//                             Edit
//                             </button>
//                             <button onClick={() => handleDelete(post._id)}>
//                                 Delete
//                             </button>
//                         </li>
//                     </React.Fragment>
//                 ))}
//             </ul>
//             {editingPost && (
//                 <form onSubmit={handleEditSubmit} style={{ marginTop: '2rem' }}>
//                     <h2>Edit Post</h2>
//                     <label>
//                         Title:
//                         <input
//                             type="text"
//                             name="postTitle"
//                             value={formData.postTitle}
//                             onChange={handleFormChange}
//                         />
//                     </label>
//                     <br />
//                     <label>
//                         Content:
//                         <textarea
//                             name="content"
//                             value={formData.content}
//                             onChange={handleFormChange}
//                         />
//                     </label>
//                     <br />
//                     <button type="submit">Save Changes</button>
//                     <button type="button" onClick={() => setEditingPost(null)} style={{ marginLeft: '1rem' }}>
//                         Cancel
//                     </button>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default MyPage;

import React, { useEffect, useState } from 'react';
// @ts-ignore - ignore typing if apiService.js is JS
import { getUserPosts, createPost, editPost, deletePost } from './apiService';
import { useNavigate } from 'react-router-dom';

const MyPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [editingPost, setEditingPost] = useState<any | null>(null); // State for the post being edited
    const [formData, setFormData] = useState({ postTitle: '', content: '' }); // Form data for editing
    const navigate = useNavigate();
    const userId = 'test_user2'; // Hardcoded user ID

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const userPosts = await getUserPosts(userId);
                console.log('User Posts:', userPosts);
                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchPosts();
    }, []);

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
            <h1>User Posts</h1>
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
                                <strong>User:</strong> {post.user}
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