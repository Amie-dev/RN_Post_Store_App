import { Router } from "express";
import BOOK from "../controllers/bookController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.middleware.js";

const bookRouter = Router();

/*
GET /api/books
GET /api/books?page=2&limit=5
GET /api/books?search=react
*/


bookRouter.route("/").get(BOOK.getAllBooks);
bookRouter.post("/", authMiddleware, upload.single("image"), BOOK.createBook);

bookRouter.get("/mybook",authMiddleware, BOOK.getAllBooks);

bookRouter
  .route("/:id")
  .get(BOOK.getBookById)
  .delete(authMiddleware, BOOK.deleteBook);

export default bookRouter;
