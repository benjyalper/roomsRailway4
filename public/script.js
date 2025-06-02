

$(document).ready(function () {
    setupNavigation();
    if ($('#room-grid').length) initHome();
    if ($('#scheduleTable').length) initSchedule();      // ← look for the table
    if ($('#roomForm').length) initRoomForm();
    if ($('#messageList').length) displayLast10Messages();
});

function setupNavigation() {
    $('#nav-schedule').click(() => { window.location.href = '/room-schedule'; });
    $('#nav-edit').click(() => { window.location.href = '/room-form'; });
    $('#nav-messages').click(() => { window.location.href = '/messages'; });
    $('#nav-signout').click(() => {
        Swal.fire({
            title: 'להתנתק?',
            showCancelButton: true,
            confirmButtonText: 'כן',
            cancelButtonText: 'לא'
        }).then(r => { if (r.isConfirmed) window.location.href = '/logout'; });
    });
    $('#backHome').click(() => { window.location.href = '/home'; });
}

function initHome() {
    // 1) Define your rooms however you like:
    // const rooms = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 'מקלט'];

    const rooms = Array.isArray(window.ROOMS) ? window.ROOMS : [];
    // 2) Grab & clear the grid container
    const $grid = $('#room-grid').empty();

    // 3) Render each room from the array
    rooms.forEach(label => {
        $grid.append(`
      <div class="room" data-room-number="${label}">
        <div class="room-number">${label}</div>
      </div>
    `);
    });

    // 4) Preserve the click behavior
    $('.room').click(function () {
        const room = $(this).data('room-number');
        window.location.href = `/room/${room}`;
    });
}

function initSchedule() {
    // 1) Set the date picker to today
    const today = moment().format('YYYY-MM-DD');
    $('#lookupDate')
        .val(today)
        .off('change')            // remove any old handlers
        .on('change', fetchDataByDate);

    // 2) Load data for today
    fetchDataByDate();
}

function fetchDataByDate() {
    const date = $('#lookupDate').val();
    fetch(`/fetchDataByDate?date=${encodeURIComponent(date)}`, {
        headers: { Accept: 'application/json' }
    })
        .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
        .then(updateScheduleGrid)
        .catch(() => Swal.fire('שגיאה בטעינת נתוני החדרים'));
}

function updateScheduleGrid(rows) {
    // Clear styling and content from all the existing table cells
    $('#scheduleTable td.grid-cell')
        .removeAttr('style')
        .empty();

    // For each booking, find the matching cells and color them
    (rows || []).forEach(r => {
        const selector = `[data-room-hour="${r.roomNumber} ${r.startTime}"]`;
        // Actually we need all cells whose data-room-hour time is between startTime (inclusive) and endTime (exclusive):
        const $cells = $('#scheduleTable td.grid-cell').filter(function () {
            const [room, time] = $(this).data('room-hour').split(' ');
            return (
                room === String(r.roomNumber) &&
                time >= r.startTime &&
                time < r.endTime
            );
        });

        // Style the range of cells
        $cells.css({
            backgroundColor: r.color,
            border: `2px solid ${r.color}`
        });

        // Show the therapist’s name in the middle cell
        const $middle = $cells.eq(Math.floor($cells.length / 2));
        $middle.append(`<div class="therapist-name">${r.names}</div>`);

        // Tooltip + click‐to‐delete
        $cells
            .off('click')
            .on('click', () => {
                Swal.fire({
                    title: 'בחר פעולה',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'מחק פגישה זו',
                    denyButtonText: 'מחק את כל הפגישות הבאות',
                    cancelButtonText: 'בטל'
                }).then(res => {
                    if (res.isConfirmed) {
                        // רק הפגישה הנוכחית
                        deleteEntry(r.id).then(fetchDataByDate);
                    } else if (res.isDenied) {
                        // your existing recurring‐delete logic…
                        deleteRecurring(r.selected_date, r.roomNumber, r.startTime)
                            .then(fetchDataByDate);
                    }
                });
            });
    });
}

function deleteEntry(id) {
    return fetch('/deleteEntry', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
}

function deleteRecurring(date, room, start) {
    return fetch('/deleteRecurring', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedDate: date, roomNumber: room, startTime: start })
    });
}

// ... the rest of your initRoomForm, messages, etc. remains unchanged ...


function initRoomForm() {
    console.log('initRoomForm sees window.TIMES =', window.TIMES);
    const $start = $('#startTime').empty();
    window.TIMES.forEach(t => $start.append(`<option value="${t}">${t}</option>`));
    $start.change(updateEndTimeOptions);
    updateEndTimeOptions();

    $('#recurringEvent').change(() => {
        $('#recurringOptions').css(
            'visibility',
            $('#recurringEvent').is(':checked') ? 'visible' : 'hidden'
        );
    });

    $('#roomForm').submit(async e => {
        e.preventDefault();

        // 1) Read basic form values
        const selectedDate = $('#selectedDate').val();
        const roomNumber = $('#roomNumber').val();
        const startTime = $('#startTime').val();
        const endTime = $('#endTime').val();
        const names = $('#names').val().trim();
        const selectedColor = $('#selectedColor').val();
        const recurringEvent = $('#recurringEvent').is(':checked');
        const recurringNum = $('#recurringNum').val();

        // 2) Load existing bookings for that date
        let rows;
        try {
            const resp = await fetch(`/fetchDataByDate?date=${encodeURIComponent(selectedDate)}`, {
                headers: { Accept: 'application/json' }
            });
            if (!resp.ok) throw new Error();
            rows = await resp.json();
        } catch {
            return Swal.fire('שגיאה בטעינת הנתונים. נסה שוב.');
        }

        // 3) Filter only this room's bookings
        const sameRoomBookings = (rows || []).filter(r => String(r.roomNumber) === String(roomNumber));

        // 4) Check for overlap
        const overlap = sameRoomBookings.some(r => {
            const existStart = moment(r.startTime, "HH:mm:ss");
            const existEnd = moment(r.endTime, "HH:mm:ss");
            const candidateStart = moment(startTime, "HH:mm");
            const candidateEnd = moment(endTime, "HH:mm");
            return candidateStart.isBefore(existEnd) && candidateEnd.isAfter(existStart);
        });

        // 5) If overlap, ask “החדר תפוס בשעה זו, האם בכל זאת לבצע את ההזמנה?”
        if (overlap) {
            const res = await Swal.fire({
                title: 'החדר תפוס בשעה זו, האם בכל זאת לבצע את ההזמנה?',
                showCancelButton: true,
                confirmButtonText: 'אישור',
                cancelButtonText: 'ביטול'
            });
            if (!res.isConfirmed) {
                // User clicked “ביטול” → do nothing
                return;
            }
            // else: user clicked “אישור” → continue to submit
        }

        // 6) If names === "פנוי", send a “פנוי” message first
        if (names === "פנוי") {
            const messageInput = `חדר ${roomNumber} פנוי בתאריך ${selectedDate} בשעות ${startTime} - ${endTime}`;
            await fetch('/submit_message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: messageInput })
            });
        }

        // 7) Finally, post to /submit
        const payload = {
            selectedDate,
            names,
            selectedColor,
            startTime,
            endTime,
            roomNumber,
            recurringEvent,
            recurringNum
        };

        try {
            await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            Swal.fire('נשמר!', '', 'success');
            $('#roomForm')[0].reset();
            updateEndTimeOptions();
        } catch {
            Swal.fire('שגיאה בשמירה. נסה שוב.');
        }
    });
}


function updateEndTimeOptions() {
    const s = $('#startTime').val();
    const valid = TIMES.filter(t =>
        moment(t, 'HH:mm').isAfter(moment(s, 'HH:mm'))
    );
    $('#endTime').empty().append(valid.map(t => `<option>${t}</option>`));
}

function displayLast10Messages() {
    fetch('/get_last_messages')
        .then(r => r.json())
        .then(data => {
            const list = $('#messageList').empty();
            data.messages.forEach((msg, i) => {
                const item = $(`
          <div class="item list-group-item animate__fadeInRight" data-index="${i}">
            <div>${msg}</div>
          </div>
        `);
                const check = $(
                    '<i class="fas fa-check-square" style="color:lightgray;"></i>'
                ).click(() => check.css('color', 'limegreen'));
                const trash = $(
                    '<i class="fas fa-trash" style="color:darkgray;"></i>'
                ).click(() => deleteMessage(data.messageIds[i], item));
                item.append($('<div>').append(check, trash));
                list.append(item);
            });
        });
}

function submitMessage() {
    const input = $('#input').val().trim();
    if (!input) return Swal.fire('אי אפשר לשלוח הודעה ריקה');
    fetch('/submit_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
    })
        .then(r => r.json())
        .then(res => {
            const item = $(`
        <div class="item animate__animated animate__bounce">
          <div>${input}</div>
        </div>
      `).attr('data-id', res.messageId);
            const check = $(
                '<i class="fas fa-check-square" style="color:lightgray;"></i>'
            ).click(() => check.css('color', 'limegreen'));
            const trash = $(
                '<i class="fas fa-trash" style="color:darkgray;"></i>'
            ).click(() => deleteMessage(res.messageId, item));
            item.append($('<div>').append(check, trash));
            $('#messageList').prepend(item);
            $('#input').val('');
        });
}

function deleteMessage(messageId, item) {
    fetch('/delete_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
    }).then(r => {
        if (r.ok) {
            item.addClass('animate__slideOutLeft');
            setTimeout(() => item.remove(), 1000);
        } else {
            Swal.fire('שגיאה במחיקת ההודעה');
        }
    });
}
