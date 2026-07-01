// Server Entry Point (Restarted)
import app from './app';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // TODO: Initialize Database Connection here
    // await dbConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
