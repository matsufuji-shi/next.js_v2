let comments = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(comments);
  } else if (req.method === 'POST') {
    const comment = req.body.comment;
    comments.push({ id: comments.length + 1, comment });
    res.status(201).json({ message: 'コメントが追加されました' });
  }
}