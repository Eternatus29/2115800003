import app from './app.js';
import dotenv from 'dotenv';

const port = 8000;
dotenv.config();

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});