const express = require('express');
const router = express.Router();
const db = require('../db');

// /shows: Get shows with theatre filter
router.get('/', async (req, res) => {
  const { theatreId } = req.query;
  try {
    let sql = 'SELECT * FROM shows';
    let params = [];
    if (theatreId) {
      sql += ' WHERE theatre_id = ?';
      params.push(theatreId);
    }
    const rows = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /showtimes: Explicit endpoint for showtimes
router.get('/showtimes', async (req, res) => {
    const { showId } = req.query;
    try {
        const rows = await db.query('SELECT * FROM showtimes WHERE show_id = ?', [showId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /seats: Explicit endpoint for seat availability
router.get('/seats', async (req, res) => {
    const { showTimeId } = req.query;
    try {
        const reservations = await db.query('SELECT seats FROM reservations WHERE show_time_id = ? AND status = "active"', [showTimeId]);
        const occupiedSeats = [];
        reservations.forEach(r => {
            const seats = typeof r.seats === 'string' ? JSON.parse(r.seats) : r.seats;
            occupiedSeats.push(...seats);
        });

        const allSeats = [];
        ['A', 'B', 'C', 'D', 'E'].forEach(row => {
            for (let i = 1; i <= 8; i++) {
                const seatId = `${row}${i}`;
                allSeats.push({ id: seatId, available: !occupiedSeats.includes(seatId) });
            }
        });
        res.json(allSeats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
