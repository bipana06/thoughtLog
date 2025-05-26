// import React, { useEffect, useState } from 'react';
// // @ts-ignore - ignore typing if apiService.js is JS
// import { getallPosts } from './apiService';


// type Post = {
//     postTitle: string;
//     user: string;
//     content: string;
//     date: string;
// };

// const DisplayAllPosts: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const data = await getallPosts(); // should return just the array of posts
//                 setPosts(data);
//             } catch (error) {
//                 console.error('Error fetching posts:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPosts();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div style={{ padding: "2rem" }}>
//             <button onClick={() => window.location.href = '/signin-with-google'}>Go to My Page</button>
//             <h1>All Posts</h1>
//             {posts.length > 0 ? (
//                 <ul>
//                     {posts.map((post, index) => (
//                         <li key={index} style={{ marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
//                             <h2>{post.postTitle}</h2>
//                             <p><strong>User:</strong> {post.user}</p>
//                             <p><strong>Content:</strong> {post.content}</p>
//                             <p><strong>Date:</strong> {post.date}</p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No posts available.</p>
//             )}
//         </div>
//     );
// };

// export default DisplayAllPosts;

import React, { useEffect, useState } from 'react';
// @ts-ignore
import { getallPosts } from './apiService';

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
        const data = await getallPosts();
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-600 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">thoughtLog</h1>
        <button
          onClick={() => (window.location.href = '/signin-with-google')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to My Page
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={index}
              className="border border-black rounded-xl shadow hover:shadow-lg transition p-6 text-left"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {post.postTitle}
              </h2>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600 mb-1">
                    {post.user}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    {post.date}
                </p>
              </div>
              <p className="text-gray-700 mb-2 line-clamp-3">
                {post.content}
              </p>
              
                <button className="text-white bg-transparent border border-black rounded-xl px-3 py-1">
                Read More
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default DisplayAllPosts;

