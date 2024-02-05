// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/public/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Express route to submit date, names, and color
app.post('/submit', async (req, res) => {
    try {
        const selectedDate = req.body.selectedDate;
        const names = req.body.names;
        const selectedColor = req.body.selectedColor;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const roomNumber = req.body.roomNumber;

        // Validate inputs (if needed)

        const client = await pool.connect();
        try {
            await client.query(
                'INSERT INTO selected_dates (selected_date, names, color, startTime, endTime, roomNumber) VALUES ($1, $2, $3, $4, $5, $6)',
                [selectedDate, names, selectedColor, startTime, endTime, roomNumber]
            );
        } finally {
            client.release();
        }

        res.status(200).send('סידור חדרים עודכן בהצלחה.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/deleteEntry', async (req, res) => {
    const { roomNumber, startTime } = req.query;

    // Validate parameters
    if (!roomNumber || !startTime) {
        return res.status(400).send('Bad Request: Missing parameters.');
    }

    try {
        const client = await pool.connect();

        // Execute a DELETE query in your database
        await client.query('DELETE FROM selected_dates WHERE roomNumber = $1 AND startTime = $2', [roomNumber, startTime]);

        client.release();

        return res.sendStatus(200); // OK status for successful deletion
    } catch (error) {
        console.error('Error deleting entry from the database:', error);
        return res.status(500).send('Internal Server Error');
    }
});


app.get('/room/:roomNumber', async (req, res) => {
    const roomNumber = req.params.roomNumber;

    try {
        // Retrieve room schedule data from MySQL database
        const client = await pool.connect();
        const [roomRows] = await client.query('SELECT * FROM selected_dates WHERE roomNumber = $1', [roomNumber]);

        // Fetch data for today
        const nowMoment = moment().format('YYYY-MM-DD');
        const [dateRows] = await client.query('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = $1', [nowMoment]);

        client.release();

        // Render the room EJS template with the room schedule and date data
        res.render('room', { roomNumber, therapist_name: roomRows, data: dateRows });
        console.log('Fetched Data:', roomRows, dateRows);
    } catch (error) {
        console.error('Error retrieving data from the database:', error);
        return res.status(500).send('Internal Server Error');
    }
});



// Express route to fetch all data for a specific date
app.get('/fetchDataByDate', async (req, res) => {
    try {
        const lookupDate = req.query.date || moment().format('YYYY-MM-DD');

        const client = await pool.connect();
        const [rows] = await client.query('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = $1', [lookupDate]);
        client.release();

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No data found for the specified date.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Express route to fetch all data for today
app.get('/dateData', async (req, res) => {
    try {
        const nowMoment = moment().format('YYYY-MM-DD');

        const client = await pool.connect();
        const [rows] = await client.query('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = $1', [nowMoment]);
        client.release();

        if (rows.length > 0) {
            // res.json(rows);
            // Render the room EJS template with the room schedule data
            res.render('dateData', { data: rows, roomNumber: '2' });
            console.log('Fetched Data:', nowMoment);
        } else {
            res.status(404).json({ error: 'No data found for the specified date.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/therapist-form', async (req, res) => {
    try {
        const formData = req.body;
        const { therapistName, roomNumber, startTime, endTime, selectedDate } = formData;


        const connection = await pool.connect();
        try {
            await client.query(
                'INSERT INTO selected_dates ( roomNumber, startTime, endTime) VALUES ($1, $2, $3)',
                [roomNumber, startTime, endTime]
            );
        } finally {
            client.release();
        }

        console.log('Data inserted into the database:', formData);
        res.status(200).send('Data inserted into the database successfully');
    } catch (error) {
        console.error('Error handling therapist-form data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Express route to delete a row
app.post('/deleteRow', async (req, res) => {
    try {
        const { roomNumber, startTime, endTime } = req.body;
        console.log({ roomNumber, startTime, endTime })

        const connection = await pool.getConnection();
        try {
            // Delete the row from the database
            await connection.execute('DELETE FROM selected_dates WHERE roomNumber = $1 AND startTime = $2 AND endTime = $3', [roomNumber, startTime, endTime]);
            res.json({ success: true });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error deleting row from the database:', error);
        res.json({ success: false, error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});