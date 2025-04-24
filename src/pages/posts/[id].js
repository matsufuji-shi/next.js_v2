import { useState, useEffect } from 'react';

// [1] getStaticPaths: ビルド時に生成するパスを指定
export async function getStaticPaths() {
  const posts = [
    { id: 1 },
    { id: 2 },
  ];

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

// [2] getStaticProps: IDごとの記事データを取得
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

// [3] 表示コンポーネント
export default function Post({ post }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // コメント取得
  useEffect(() => {
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  // コメント送信
  const submitComment = async () => {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentText }),
    });

    setCommentText('');
    fetch('/api/comments')
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  // post がない場合の保険（防御的プログラミング）
  if (!post) return <div>読み込み中...</div>;

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
