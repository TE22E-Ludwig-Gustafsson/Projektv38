const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Debug logging middleware
router.use((req, res, next) => {
    console.log(`\n=== ${req.method} ${req.path} ===`);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});

// GET alla objekt
router.get("/", async (req, res) => {
  try {
    const userClass = req.query.class;
    console.log("\n=== GET /items ===");
    console.log("Request class parameter:", userClass);
    
    // Strikt filtrering på klass
    const query = {};
    if (userClass && userClass !== "undefined" && userClass !== "null" && userClass !== "") {
      console.log("Applying class filter for:", userClass);
      query.class = userClass;
    } else {
      console.log("No class filter - admin view");
    }
    
    console.log("MongoDB query:", query);
    const items = await Item.find(query).sort({ date: 1 });
    
    console.log("\nFound courses:", items.length);
    if (items.length > 0) {
      console.log("Course details:");
      items.forEach(item => {
        console.log(`- ${item.name} (Class: ${item.class})`);
      });
    }
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nytt objekt (admin only)
router.post("/", async (req, res) => {
  try {
    console.log("Creating new course with data:", req.body);
    const newItem = new Item({
      name: req.body.name,
      date: req.body.date,
      teacher: req.body.teacher,
      description: req.body.description || "",
      class: req.body.class,
    });

    console.log("Saving new course:", newItem);
    await newItem.save();
    console.log("Course saved successfully:", newItem);
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT uppdatera objekt (admin only)
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating course with data:", req.body);
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        date: req.body.date,
        teacher: req.body.teacher,
        description: req.body.description || "",
        class: req.body.class, // Lägg till class i uppdateringen
      },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE objekt (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
