const Unit = require("../models/Unit");

const createUnit = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    const unit = new Unit({
      name,
      user: userId,
    });

    await unit.save();

    res.status(201).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUnit = async (req, res) => {
  try {
    const units = await Unit.find({ user: req.user.userId });

    res.status(200).json(units);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUnit = async (req, res) => {
  try {
    const { name } = req.body;
    const unitId = req.params.id;
    const userId = req.user.userId;
    const existing = await Unit.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "already exists" });
    }
    const unit = await Unit.findByIdAndUpdate(
      {
        _id: unitId,
        user: userId,
      },
      { name },
      { new: true }
    );

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unitId = req.params.id;
    const userId = req.user.userId;
    const unit = await Unit.findOneAndDelete({
      _id: unitId,
      user: userId,
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUnit, getUnit, updateUnit, deleteUnit };
