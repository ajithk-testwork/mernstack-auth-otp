import Note from "../models/userNotes.js";
import User from "../models/userModel.js";

// CREATE NOTE

export const createNote = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const note = await Note.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id,
      userName: user.name,
      userEmail: user.email,
    });

    
    const populatedNote = await Note.findById(note._id).populate(
      "userId",
      "name email",
    );

    res.status(201).json(populatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET NOTES

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).populate(
      "userId",
      "name email",
    );

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE NOTE

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE NOTE

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted Note" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
