let comments = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'postId is required' });
    }

    const filtered = comments.filter(comment => comment.postId === String(postId));
    return res.status(200).json(filtered);
  }

  if (req.method === 'POST') {
    const { comment, postId } = req.body;

    if (!comment || !postId) {
      return res.status(400).json({ error: 'comment and postId are required' });
    }

    const newComment = {
      id: comments.length + 1,
      postId: String(postId),
      comment,
    };

    comments.push(newComment);
    return res.status(201).json(newComment);
  }

  res.status(405).json({ error: 'Method not allowed' });
}