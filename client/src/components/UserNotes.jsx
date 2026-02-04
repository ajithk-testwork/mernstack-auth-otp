import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Layout,
  User,
  LogOut,
  ChevronRight,
  Save,
  Clock,
  Settings,
  CheckCircle,
} from "lucide-react";
import API from "../api";

export default function UserNotes() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState({ name: "User", email: "" });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const loadInitialData = async () => {
    if (!token || !userId) return navigate("/login");

    try {
      const userRes = await API.get(`/users/${userId}`);
      setUserData(userRes.data);

      const notesRes = await API.get("/notes");
      setNotes(notesRes.data);

      if (notesRes.data.length > 0) {
        selectNote(notesRes.data[0]);
      } else {
        handleNewNote();
      }
    } catch (err) {
      console.error("Data load failed:", err.response || err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      console.log("Logout Error: ", error);
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  const selectNote = (note) => {
    setIsCreating(false);
    setActiveNoteId(note._id);
    setEditTitle(note.title || "");
    setEditDesc(note.description || "");
  };

  const handleNewNote = () => {
    setIsCreating(true);
    setActiveNoteId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return alert("Title required");
    try {
      if (isCreating) {
        await API.post("/notes", { title: editTitle, description: editDesc });
        showToast("Note created successfully!");
      } else {
        await API.put(`/notes/${activeNoteId}`, {
          title: editTitle,
          description: editDesc,
        });
        showToast("Note updated successfully!");
      }
      loadInitialData();
    } catch (err) {
      showToast("Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/${id}`);
      showToast("Note deleted successfully!", "error");
      loadInitialData();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-hidden">
    
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border text-white font-bold ${
              toast.type === "error"
                ? "bg-red-500 border-red-600"
                : "bg-emerald-500 border-emerald-600"
            }`}
          >
            <CheckCircle size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className="w-80 border-r border-slate-100 bg-[#F8FAFC] flex flex-col transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Layout size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              StudyNotes
            </span>
          </div>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 space-y-2">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              onClick={() => selectNote(note)}
              className={`group flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                activeNoteId === note._id
                  ? "bg-white shadow-md border-indigo-100 border"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-bold truncate ${activeNoteId === note._id ? "text-indigo-600" : ""}`}
                >
                  {note.title || "Untitled"}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {note.description || "Start writing..."}
                </p>
              </div>
              <ChevronRight
                size={14}
                className={
                  activeNoteId === note._id
                    ? "text-indigo-400"
                    : "opacity-0 group-hover:opacity-100"
                }
              />
            </div>
          ))}
        </nav>

        {/* PROFILE FOOTER */}
        <div className="p-6 bg-white border-t border-slate-100 relative">
          <div
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="flex items-center gap-3">
             
              <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold border border-indigo-200 shadow-sm">
                {userData.profileImage ? (
                  <img
                    src={`http://localhost:5000${userData.profileImage}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }} 
                  />
                ) : (
                  <span>{userData.name.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {userData.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  View Account
                </p>
              </div>
            </div>
            <Settings size={16} className="text-slate-300" />
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 left-6 right-6 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-50"
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-slate-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* EDITOR */}
      <main className="flex-1 flex flex-col bg-white">
        <header className="h-20 border-b border-slate-50 px-10 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md">
          <div className="flex gap-4">
            {!isCreating && (
              <button
                onClick={() => handleDelete(activeNoteId)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
            >
              <Save size={18} /> {isCreating ? "Save Note" : "Update"}
            </button>
          </div>
          <button
            onClick={handleNewNote}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <Plus size={18} /> New Entry
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="max-w-3xl mx-auto py-20 px-12 bg-white min-h-full shadow-[0_0_50px_rgba(0,0,0,0.02)]">
            <input
              className="w-full text-5xl font-black outline-none mb-8 placeholder:text-slate-100 tracking-tight"
              placeholder="Untitled"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full h-[60vh] text-xl leading-relaxed outline-none resize-none placeholder:text-slate-200"
              placeholder="Write something amazing..."
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
