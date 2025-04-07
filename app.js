const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const comments = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/blog', (req, res) => {
  const blogPath = path.join(__dirname, 'public', 'blog.html');
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) return res.send('Error loading blog page.');

    const commentHtml = comments.map(c => `
      <div style="background:#f9f9f9;padding:10px;margin:10px 0;border-left:4px solid #ffa500;">
        <strong>${c.username}</strong>: ${c.comment}
      </div>
    `).join('');

    const finalHtml = data.replace('<!-- COMMENTS_PLACEHOLDER -->', commentHtml);
    res.send(finalHtml);
  });
});

app.post('/blog', (req, res) => {
  const { username, comment } = req.body;
  if (username && comment) {
    comments.push({ username, comment });
    console.log("📝 New Comment Received:");
    console.log("Name:", username);
    console.log("Comment:", comment);
  }
  res.redirect('/blog');
});

app.listen(PORT, () => {
  console.log(`🚀 JAM Blogs is running at http://localhost:${PORT}`);
});
