// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise'; // Use the promise version of mysql2
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';



const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

// Create a MySQL connection pool
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Ag1ag1ag1$',
//     database: 'wishDatabase',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

const pool = mysql.createPool({
    user: 'root',
    password: 'Ag1ag1ag1$',
    database: 'rooms1234',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    socketPath: '/cloudsql/united-park-386203:europe-west1:rooms1234',
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
        const selectedColor = req.body.selectedColor; // Get the selected color
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const roomNumber = req.body.roomNumber;

        // Validate inputs (if needed)

        const connection = await pool.getConnection();
        await connection.execute('INSERT INTO selected_dates (selected_date, names, color, startTime, endTime, roomNumber) VALUES (?, ?, ?, ?, ?, ?)', [selectedDate, names, selectedColor, startTime, endTime, roomNumber]);
        connection.release();

        res.status(200).send('סידור חדרים עודכן בהצלחה.');
        alert("hello")
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
        const connection = await pool.getConnection();

        // Execute a DELETE query in your database
        await connection.execute('DELETE FROM selected_dates WHERE roomNumber = ? AND startTime = ?', [roomNumber, startTime]);

        connection.release();

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
        const connection = await pool.getConnection();
        const [roomRows] = await connection.execute('SELECT * FROM selected_dates WHERE roomNumber = ?', [roomNumber]);

        // Fetch data for today
        const nowMoment = moment().format('YYYY-MM-DD');
        const [dateRows] = await connection.execute('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = ?', [nowMoment]);

        connection.release();

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

        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = ?', [lookupDate]);
        connection.release();

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

        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT names, color, startTime, endTime, roomNumber FROM selected_dates WHERE selected_date = ?', [nowMoment]);
        connection.release();

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


        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO selected_dates ( roomNumber, startTime, endTime) VALUES (?, ?, ?)',
                [roomNumber, startTime, endTime]
            );
        } finally {
            connection.release();
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
            await connection.execute('DELETE FROM selected_dates WHERE roomNumber = ? AND startTime = ? AND endTime = ?', [roomNumber, startTime, endTime]);
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