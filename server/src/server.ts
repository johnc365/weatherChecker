import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Verify required environment variables are loaded
if (!process.env.API_BASE_URL || !process.env.API_KEY) {
    throw new Error('Missing required environment variables. Ensure API_BASE_URL and API_KEY are set in the .env file.');
}

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.resolve(__dirname, '../../client/dist')));
app.use(express.json());

// TODO: Implement middleware to connect the routes
import routes from './routes';
app.use(routes);

// Example route
app.get('/', (_req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
