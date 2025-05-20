import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/blogposts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      alert('Failed to fetch comments');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post('/blogposts/comment', { blogPostId: postId, content });
      setContent('');
      fetchComments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Post</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.author}</strong>: <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
