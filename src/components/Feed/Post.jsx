import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from "@material-tailwind/react";
import Rune from './Rune';
import { LikeIcon, ReplyIcon, ReportIcon } from './Icons';
import axios from 'axios';

const Post = ({ post, postId }) => {
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false); // New state for reporting
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentCount, setCommentCount] = useState(post.replies ? post.replies : 0);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const sessionToken = userData ? userData.token : null;

  const getLike = () => {
    axios.get(`http://127.0.0.1:8000/post/like/${postId}`, {
      headers: {
        Authorization: `Token ${sessionToken}`,
      },
    }).then((response) => {
      if (response.data.success) {
        setLikeCount(response.data.likeCount);
      } else {
        console.error(response.data.message);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const fetchComments = () => {
    axios.get(`http://127.0.0.1:8000/post/comments/${postId}/`)
      .then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLike = () => {
    axios.post(`http://127.0.0.1:8000/post/like/${postId}`, null, {
      headers: {
        Authorization: `Token ${sessionToken}`,
      },
    }).then((response) => {
      if (response.data.success) {
        getLike();
      } else {
        console.error(response.data.message);
      }
    }).catch((error) => {
      console.error(error);
    });
    // Comment out below two lines
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleReport = () => {
    if (reported) {
      // If already reported, unreport the post.
      axios.post(`http://127.0.0.1:8000/post/report/${postId}/`, null, {
        headers: {
          Authorization: `Token ${sessionToken}`,
        },
      }).then((response) => {
        if (response.data.success) {
          setReported(false);
        } else {
          console.error(response.data.message);
        }
      }).catch((error) => {
        console.error(error);
      });
    } else {
      // If not reported, report the post.
      axios.post(`http://127.0.0.1:8000/post/report/${postId}/`, null, {
        headers: {
          Authorization: `Token ${sessionToken}`,
        },
      }).then((response) => {
        if (response.data.success) {
          setReported(true);
        } else {
          console.error(response.data.message);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  const handleCommentClick = () => {
    fetchComments();
    setShowCommentBox(!showCommentBox);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      axios.post(`http://127.0.0.1:8000/post/comments/${postId}/`, {
        comment: newComment,
      }).then((response) => {
        if (response.data.success) {
          fetchComments();
          setNewComment('');
          setCommentCount(commentCount + 1);
        } else {
          console.error(response.data.message);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  };

  // useEffect(() => {
  //   getLike();
  //   fetchComments();
  //   handleReport();
  // }, [postId]);

  return (
    <div className="border-t-[2px] hover:bg-gray-200 transition-colors duration-500 ease-out px-4 pt-3 pb-2">
      <div className="flex gap-1 items-center">
        <Avatar src={post.image} alt="avatar" size='sm' className={`${post.isAnonymous ? 'hidden' : 'block'}`} />
        <Typography variant="paragraph">{post.isAnonymous ? '' : post.name}</Typography>
        <Typography variant="small" color="gray" className={`${post.isAnonymous ? 'font-bold text-md' : 'font-normal'}`}>
          @{post.isAnonymous ? 'Anonymous User' : post.username}
        </Typography>
      </div>
      <p className="text-gray-600 mt-2">{post.caption}</p>

      <div className="mt-4 flex justify-between">
        <div className='flex items-center group' onClick={handleLike}>
          <Rune
            Icon={<LikeIcon fill="group-hover:fill-red-500" />}
            color="group-hover:bg-red-100"
          />
          <span className="group-hover:text-red-500">{likeCount}</span>
        </div>
        <div className="flex items-center group" onClick={handleCommentClick}>
          <Rune
            Icon={<ReplyIcon fill="group-hover:fill-red-500" />}
            color="group-hover:bg-red-100"
          />
          <span className="group-hover:text-red-500">{commentCount}</span>
        </div>
        <div className="flex items-center group" onClick={handleReport}>
          <Rune
            Icon={<ReportIcon fill="group-hover:fill-red-500" />}
            color="group-hover:bg-red-100"
          />
          {reported ? (
            <span className="group-hover:text-red-500">Reported</span>
          ) : (
            <span>Report</span>
          )}
        </div>
      </div>

      {showCommentBox && (
        <div className="mt-4">
          <input
            type="text"
            className="border rounded-md p-2 w-full"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Comments:</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="mt-2">{comment.comment_text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;

