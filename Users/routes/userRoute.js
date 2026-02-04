import express from "express";
import { deleteUser, getAllUser, getUserId, updateUser, loginUser, logoutUser, uploadProfileImage, registerUser, forgotPassword, verifyOtp, resetPassword } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import noteProtect from "../middleware/noteProtect.js";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/noteController.js";

const router = express.Router();

router.post("/users/register", upload.single("image"), registerUser);
router.post("/users/login", loginUser);
router.post("users/logout", authMiddleware, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword)
router.put(
  "/users/:id/profile-image/",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);
router.get("/users", getAllUser);
router.get("/users/:id",authMiddleware, getUserId);
router.put("/users/:id",authMiddleware, updateUser)
router.delete("/users/:id",authMiddleware, deleteUser)


// Notes
router.post("/notes", noteProtect, createNote);
router.get("/notes", noteProtect, getNotes);
router.put("/notes/:id", noteProtect, updateNote);
router.delete("/notes/:id", noteProtect, deleteNote);



export default router;