import React, { useEffect, useState } from 'react';
// @ts-ignore
import { getallPosts } from './apiService';

type Post = {
  postTitle: string;
  email: string;
  username: string;
  content: string;
  date: string;
  name: string;
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
    <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-800 text-center md:text-left mb-4 md:mb-0">
          thoughtLog
        </h1>
        <button
          onClick={() => (window.location.href = '/signin-with-google')}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Go to My Page
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between"
            >
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-4 text-center">
                {post.postTitle}
              </h2>
              <div className="text-sm text-gray-500 text-center mb-4">
                <span>{post.username}</span> &middot; <span>{post.date.slice(0, 10)}</span>
              </div>
              <p className="text-gray-800 mb-6 leading-relaxed whitespace-pre-line line-clamp-4">
                {post.content}
              </p>
              <div className="text-center">
                <button className="text-sm text-gray-700 border border-gray-400 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No posts available.</p>
      )}
    </div>
  );
};

export default DisplayAllPosts;

