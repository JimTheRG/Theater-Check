const express = require('express');
const router = express.Router();
const db = require('../db');

// SEARCH: Supports location, theatre name, or show title
router.get('/', async (req, res) => {
  const { query } = req.query;
  try {
    let sql, params;
    if (query) {
      // Join with shows to search by show title as well
      sql = `
        SELECT DISTINCT t.* FROM theatres t
        LEFT JOIN shows s ON t.theatre_id = s.theatre_id
        WHERE t.name LIKE ? OR t.location LIKE ? OR s.title LIKE ?
      `;
      params = [`%${query}%`, `%${query}%`, `%${query}%`];
    } else {
      sql = 'SELECT * FROM theatres';
      params = [];
    }
    const rows = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
