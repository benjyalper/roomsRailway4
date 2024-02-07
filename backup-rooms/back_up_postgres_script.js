$(document).ready(function () {
    let currentRoomNumber;

    $('.door').on('click', function () {
        const room = $(this).closest('.room');
        currentRoomNumber = $(room).data('room-number');
        console.log(currentRoomNumber)
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/room/' + currentRoomNumber;
    });

    $('.back-btn').click(function () {
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/';
    });

    $('.now').click(function () {
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/dateData/';
    });

    $('.room-schedule-link').click(function () {
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/room-schedule.html';
    });

    // $('.room-form-link').click(function () {
    //     window.location.href = '/room-form.html';
    // });

    $('.drop-down-to-room-form-link').click(function () {
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/room-form.html';
    });

    $('.cat-link').click(function () {
        window.location.href = 'https://rooms-scheduler-65113cf9659f.herokuapp.com/cat.html';
    });

    $('.cat').on('click', function () {
        alert("חתלתוללללל....!");
    });

});

$(document).ready(function () {
    fetchDataByDate();
});


// Function to submit date
async function submitDate() {
    const selectedDate = $('#selectedDate').val();
    const names = $('#names').val();
    const selectedColor = $('#selectedColor').val();
    const startTime = $('#startTime').val();
    const endTime = $('#endTime').val();
    const roomNumber = $('#roomNumber').val();

    const response = await fetch('https://rooms-scheduler-65113cf9659f.herokuapp.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedDate, names, selectedColor, startTime, endTime, roomNumber }),
    });

    const result = await response.text();
    $('#message').text(result);

    // Log the submitted data to the console
    console.log(`Submitted Date: ${selectedDate}, Names: ${names}, Color: ${selectedColor}, Start Time: ${startTime}, End Time: ${endTime}, Room Number: ${roomNumber}`);
}


// Function to fetch data by date
async function fetchDataByDate() {
    const lookupDate = $('#lookupDate').val() || moment().format('YYYY-MM-DD');

    try {
        const encodedDate = encodeURIComponent(lookupDate);
        const response = await fetch(`https://rooms-scheduler-65113cf9659f.herokuapp.com/fetchDataByDate?date=${encodedDate}`);
        const results = await response.json();

        if (results.length > 0) {
            // Clear the grid cells before updating
            $('.grid-cell').css({
                'background-color': 'white',
                'border': '1px solid black',  // Reset the border
            });

            $('.frame').css({
                'background-color': 'rgb(235, 237, 236)'
            });

            // Iterate through the results and update the grid cells
            results.forEach(result => {
                const cell = $(`.grid-cell[data-room-hour="${result.roomNumber} ${result.startTime}"]`);
                const nextCell = $(`.grid-cell[data-room-hour="${result.roomNumber} ${result.endTime}"]`);

                // Get all cells with the same room number between cell and nextCell
                const cellsToColor = cell.nextUntil(nextCell).addBack().filter(`[data-room-hour^="${result.roomNumber}"]`);

                // Color the grid cells
                cellsToColor.css({
                    'background-color': result.color,
                    'border': `2px solid ${result.color}`,
                });

                // Find the middle cell in the colored area
                const middleCellIndex = Math.floor(cellsToColor.length / 2);
                const middleCell = cellsToColor.eq(middleCellIndex);

                // Add content to the cell
                const middleContent = '<div class="therapist-name" "style="font-size: 28px;">' + result.names + '</div>';
                middleCell.html(middleContent);

                cellsToColor.tooltip({
                    title: 'מטפל/ת: ' + result.names + ' ' + 'חדר: ' + result.roomNumber + '<br>' + 'לחצ/י להסרה', // Tooltip content
                    placement: 'top', // Set tooltip placement
                    html: true
                });

                cellsToColor.on('click', function () {
                    const deleteConfirmation = confirm('האם להסיר פגישה זו?');

                    if (deleteConfirmation) {
                        // Implement your delete logic here
                        deleteEntry(result.roomNumber, result.startTime);
                        fetchDataByDate()
                    } else {
                        // Redirect to room form
                        window.location.href = `https://rooms-scheduler-65113cf9659f.herokuapp.com/room-form.html`;
                    }

                    async function deleteEntry(roomNumber, startTime) {
                        try {
                            const response = await fetch(`https://rooms-scheduler-65113cf9659f.herokuapp.com/deleteEntry?roomNumber=${roomNumber}&startTime=${startTime}`, {
                                method: 'DELETE',
                            });

                        } catch (error) {
                            console.error(error);
                            throw error;
                        }
                    }
                });
            });


            // Display retrieved data
            const displayResults = results.map(result => `
                <p>Names: ${result.names}</p>
                <p>Color: ${result.color}</p>
                <p>Start Time: ${result.startTime}</p>
                <p>selected Time: ${result.startTime}</p>
                <p>End Time: ${result.endTime}</p>
                <p>therapist name: ${result.names}</p>
                <p>room number: ${result.roomNumber}</p>
                <hr>
            `).join('');



        } else {
            // Reset the color square's background color
            $('#lookupResult').text(`No data found for ${lookupDate}.`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// Function to fetch data by date
async function dateData() {
    const nowMoment = moment().format('YYYY-MM-DD');

    try {
        const encodedDate = encodeURIComponent(nowMoment);
        const response = await fetch(`https://rooms-scheduler-65113cf9659f.herokuapp.com/dateData?date=${encodedDate}`);
        const results = await response.json();
        console.log(nowMoment.names)

        if (results.length > 0) {

        } else {
            // Reset the color square's background color
            $('#nowMoment').text(`No data found for ${nowMoment}.`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to check if the current time is within a specified range
function isCurrentTimeInRange(startTime, endTime) {
    const now = new Date();

    const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
    const startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes, startSeconds);

    const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);
    const endDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes, endSeconds);

    return now >= startDateTime && now <= endDateTime;
}

// Other functions and code in your script.js file
$(document).ready(function () {
    $('#lookupDate').val(new Date().toISOString().slice(0, 10));
});

// Function to delete colored cells and corresponding row from the database
async function deleteColoredCells(roomNumber, startTime, endTime) {
    try {
        // Make a server-side request to delete the corresponding row from the database
        const response = await fetch('https://rooms-scheduler-65113cf9659f.herokuapp.com/deleteRow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomNumber, startTime, endTime }),
        });

        const result = await response.json();

        if (result.success) {
            // Remove the colored cells from the frontend
            const cellsToDelete = $(`.grid-cell[data-room-hour^="${roomNumber} ${startTime}"]`);

            cellsToDelete.each(function () {
                console.log('Deleting cell:', this); // Log each cell being deleted

                $(this).css({
                    'background-color': 'white',
                    'border': '1px solid black',
                });
                $(this).html(''); // Remove content from the cells
            });

            console.log('Cells deleted successfully');
        } else {
            console.error('Error deleting row:', result.error);
        }
    } catch (error) {
        console.error('Error deleting row:', error);
    }
}

// Function to show the delete tooltip
// Function to show the delete tooltip
function showDeleteTooltip(roomNumber, startTime, endTime) {
    const tooltipContent = `
        <div class="delete-tooltip">
            <p>Delete</p>
        </div>
    `;

    const cell = $(`.grid-cell[data-room-hour="${roomNumber} ${startTime}"]`);
    const tooltip = $(tooltipContent);

    // Position the tooltip
    const cellOffset = cell.offset();
    const tooltipTop = cellOffset.top + cell.height() / 2 - tooltip.height() / 2;
    const tooltipLeft = cellOffset.left + cell.width() / 2 - tooltip.width() / 2;

    tooltip.css({ top: tooltipTop, left: tooltipLeft });

    // Append the tooltip to the body
    $('body').append(tooltip);

    // Attach click event to delete button
    tooltip.find('p').on('click', async function () {
        await deleteColoredCells(roomNumber, startTime, endTime);
        tooltip.remove(); // Remove the tooltip after deletion
    });
}

// Attach click event to delete button using event delegation
$('body').on('click', '.delete-tooltip p', async function () {
    await deleteColoredCells(roomNumber, startTime, endTime);
    $('.delete-tooltip').remove(); // Remove the tooltip after deletion
});


// Function to hide the delete tooltip
function hideDeleteTooltip() {
    $('.delete-tooltip').remove();
}

// Function to delete cells and corresponding row
async function deleteCellsAndRow(roomNumber, startTime, endTime) {
    // Perform deletion logic here, e.g., make a server-side request to delete the data

    try {
        const response = await fetch('https://rooms-scheduler-65113cf9659f.herokuapp.com/deleteCellsAndRow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomNumber, startTime, endTime }),
        });

        const result = await response.text();
        console.log(result); // Log the result of the deletion
    } catch (error) {
        console.error('Error deleting cells and row:', error);
    }
}


// Function to check who is in the room now
// async function whosHereNow() {
//     try {
//         // Make a server-side request to check room occupancy
//         const response = await fetch('/isRoomOccupied');
//         const occupancyInfo = await response.json();

//         if (occupancyInfo.isOccupied) {
//             console.log(`Room is occupied by ${occupancyInfo.occupiedName} now.`);
//         } else {
//             console.log('Room is not occupied.');
//         }
//     } catch (error) {
//         console.error('Error checking room occupancy:', error);
//     }
// }



