import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ status: 'Server is running properly!' });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});