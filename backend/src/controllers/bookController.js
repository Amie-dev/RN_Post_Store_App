import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.js";

class BOOK {
  static async createBook(req, res) {
    try {
      const { title, caption, rating } = req.body;

      // file comes from multer
      const file = req.file;
      console.log(req.file);
      if (!title || !caption || !rating || !file) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // convert buffer to base64
      const base64 = file.buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64}`;

      // upload to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "books",
      });
      console.log(uploadResponse);
      const newBook = await Book.create({
        title,
        caption,
        rating,
        image: {
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        },
        user: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: newBook,
      });
    } catch (error) {
      console.log("Create Book Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async getAllBooks(req, res) {
    try {
      // ✅ Query params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";

      const skip = (page - 1) * limit;

      // ✅ Search filter
      const filter = {
        title: { $regex: search, $options: "i" }, // case-insensitive
      };

      // ✅ Fetch books
      const books = await Book.find(filter)
        .populate("user", "username email profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // ✅ Total count (for pagination)
      const total = await Book.countDocuments(filter);

      return res.status(200).json({
        success: true,
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        data: books,
      });
    } catch (error) {
      console.log("Get All Books Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async getBookById(req, res) {
    try {
      const { id } = req.params;

      // ✅ Validate Mongo ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid book ID",
        });
      }

      const book = await Book.findById(id).populate(
        "user",
        "username email profileImage",
      );

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error) {
      console.log("Get Book Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  static async getMyBooks(req, res) {
    try {
      const books = await Book.find({ user: req.user._id });

      return res.json({
        success: true,
        data: books,
      });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }

  static async deleteBook(req, res) {
    try {
      const { id } = req.params;
console.log(id)
      // ✅ Validate ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid book ID",
        });
      }

      // ✅ Find book
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      // 🔐 Authorization (only owner can delete)
      if (book.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this book",
        });
      }

      if (book.image?.public_id) {
        await cloudinary.uploader.destroy(book.image?.public_id);
      }

      // ✅ Delete
      await Book.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      console.log("Delete Book Error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}

export default BOOK;
