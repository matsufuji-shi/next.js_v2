import { useState, useEffect } from 'react';

export async function getStaticPaths() {
  const posts = [
    { id: 1 }, { id: 2 }
  ];

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const postId = params.id;
  const post = {
    id: postId,
    title: `ブログ記事 ${postId}`,
    content: `これは記事 ${postId} の内容です。`,
  };

  return {
    props: {
      post,
    },
  };
}

export default function Post({ post }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // コメントを取得
  const fetchComments = () => {
    fetch(`/api/comments?postId=${post.id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  // コメントを送信
  const submitComment = async () => {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText, postId: post.id }),
    });

    setCommentText('');
    fetchComments();
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <h2>コメント一覧</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.comment}</li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={submitComment}>コメントを追加</button>
      </div>
    </div>
  );
}