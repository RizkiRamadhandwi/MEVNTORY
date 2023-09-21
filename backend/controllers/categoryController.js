const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    const existing = await Category.findOne({ name, user: userId });
    if (existing) {
      return res.status(400).json({ message: "already exists" });
    }

    const category = new Category({
      name,
      user: userId,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.userId });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;
    const userId = req.user.userId;
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "already exists" });
    }

    const category = await Category.findOneAndUpdate(
      {
        _id: categoryId,
        user: userId,
      },
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const userId = req.user.userId;
    const category = await Category.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
