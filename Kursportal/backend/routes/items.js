const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const auth = require("../middleware/auth");

// GET alla objekt
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nytt objekt (admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Ej behörighet" });

  try {
    const newItem = new Item({
      name: req.body.name,
      date: req.body.date, 
      teacher: req.body.teacher,
      description: req.body.description || '' 
    });

    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT uppdatera objekt (admin only)
router.put("/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Ej behörighet" });

  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        date: req.body.date, // ISO-sträng
        teacher: req.body.teacher,
        description: req.body.description || ''
      },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE objekt (admin only)
router.delete("/:id", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: "Ej behörighet" });
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
