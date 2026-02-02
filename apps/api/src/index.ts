import app from './app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.info(`API server running on http://localhost:${PORT}`);
});
