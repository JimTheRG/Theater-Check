const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// Create reservation
router.post('/', verifyToken, async (req, res) => {
  const { showId, showTimeId, seats } = req.body;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'INSERT INTO reservations (user_id, show_id, show_time_id, seats) VALUES (?, ?, ?, ?)',
      [userId, showId, showTimeId, JSON.stringify(seats)]
    );
    res.status(201).json({ message: 'Reservation created', reservationId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user reservations
router.get('/user', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const rows = await db.query(`
      SELECT r.*, s.title as showTitle, st.show_date, st.show_time, t.name as theatreName
      FROM reservations r
      JOIN shows s ON r.show_id = s.show_id
      JOIN showtimes st ON r.show_time_id = st.show_time_id
      JOIN theatres t ON s.theatre_id = t.theatre_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update reservation
router.put('/:id', verifyToken, async (req, res) => {
    const { seats, status } = req.body;
    const reservationId = req.params.id;
    const userId = req.user.userId;

    try {
        let sql = 'UPDATE reservations SET ';
        let params = [];
        if (seats) {
            sql += 'seats = ?, ';
            params.push(JSON.stringify(seats));
        }
        if (status) {
            sql += 'status = ?, ';
            params.push(status);
        }
        sql = sql.slice(0, -2); // Remove last comma
        sql += ' WHERE reservation_id = ? AND user_id = ?';
        params.push(reservationId, userId);

        const result = await db.query(sql, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found or unauthorized' });
        }
        res.json({ message: 'Reservation updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cancel reservation
router.delete('/:id', verifyToken, async (req, res) => {
  const reservationId = req.params.id;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'UPDATE reservations SET status = "cancelled" WHERE reservation_id = ? AND user_id = ?',
      [reservationId, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found or unauthorized' });
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
