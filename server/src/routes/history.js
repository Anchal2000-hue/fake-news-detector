import express from "express";
import { protect } from "../middleware/auth.js";
import Check from "../models/Check.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Number.parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Check.find({ user: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Check.countDocuments({ user: req.userId }),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load history", error: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const check = await Check.findOne({ _id: req.params.id, user: req.userId });
    if (!check) return res.status(404).json({ message: "Check not found" });
    res.json(check);
  } catch (err) {
    res.status(500).json({ message: "Failed to load check", error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const check = await Check.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!check) return res.status(404).json({ message: "Check not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete check", error: err.message });
  }
});

export default router;
