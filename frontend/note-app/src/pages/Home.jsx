import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut, Pin, Edit2, Trash2 } from "lucide-react";

function Home() {


  // The notesapp logic
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes") || "[]"));
  const [isLatestFirst, setIsLatestFirst] = useState(() => JSON.parse(localStorage.getItem("isLatestFirst") || "true"));
  const [titleInput, setTitleInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [pinnedExpanded, setPinnedExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);

  useEffect(() => localStorage.setItem("notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("isLatestFirst", JSON.stringify(isLatestFirst)), [isLatestFirst]);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  }

  function addNote() {
    const title = titleInput.trim();
    const content = contentInput.trim();
    if (!title && !content) return;

    if (editingNote) {
      setNotes(notes.map(note => note.id === editingNote.id ? { ...note, title, content, timestamp: new Date() } : note));
      setEditingNote(null);
    } else {
      setNotes([...notes, { id: Date.now(), title: title || "Untitled", content, pinned: false, timestamp: new Date() }]);
    }
    setTitleInput("");
    setContentInput("");
  }

  function deleteNote(id) {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote?.id === id) {
      setEditingNote(null);
      setTitleInput("");
      setContentInput("");
    }
  }

  function togglePin(id) {
    setNotes(notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
  }

  function editNote(note) {
    setEditingNote(note);
    setTitleInput(note.title);
    setContentInput(note.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingNote(null);
    setTitleInput("");
    setContentInput("");
  }

  const sortedNotes = [...notes].sort((a, b) => isLatestFirst ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp));
  const pinnedNotes = sortedNotes.filter(note => note.pinned);
  const regularNotes = sortedNotes.filter(note => !note.pinned);

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-sky-100 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
        
        {/* Header with the title and logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOut className="w-6 h-5"  /> Logout
          </button>
        </div>

        {/*The Input Section */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col gap-3">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Note title..."
            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-400"
          />
          <textarea
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder="Note content..."
            rows="4"
            className="w-full p-3 border border-gray-200 rounded-lg outline-none resize-none focus:border-blue-400"
          />
          <div className="flex gap-2">
            <button
              onClick={addNote}
              className={`flex-1 px-5 py-2 rounded-lg text-white transition-colors ${editingNote ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {editingNote ? "Update Note" : "Add Note"}
            </button>
            {editingNote && (
              <button onClick={cancelEdit} className="px-5 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/*This is the Sort Button */}
        <div className="flex justify-end">
          <button onClick={() => setIsLatestFirst(!isLatestFirst)} className="bg-white border border-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors">
            {isLatestFirst ? "Sort by Oldest" : "Sort by Latest"}
          </button>
        </div>

        {/* Pin Notes feature */}
        {pinnedNotes.length > 0 && (
          <NotesSection
            title="Pinned Notes"
            notes={pinnedNotes}
            expanded={pinnedExpanded}
            setExpanded={setPinnedExpanded}
            onTogglePin={togglePin}
            onDelete={deleteNote}
            onEdit={editNote}
            editingNote={editingNote}
          />
        )}

        {/* All Notes */}
        <NotesSection
          title="All Notes"
          notes={regularNotes}
          expanded={notesExpanded}
          setExpanded={setNotesExpanded}
          onTogglePin={togglePin}
          onDelete={deleteNote}
          onEdit={editNote}
          editingNote={editingNote}
        />
      </div>
    </div>
  );
}

function NotesSection({ title, notes, expanded, setExpanded, onTogglePin, onDelete, onEdit, editingNote }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div onClick={() => setExpanded(!expanded)} className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          <span className="bg-gray-200 px-2 py-0.5 rounded-xl text-sm">{notes.length}</span>
        </div>
      </div>
      {expanded && (
        <div className="p-2">
          {notes.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No notes yet. Create your first note above!</div>
          ) : (
            notes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                isEditing={editingNote?.id === note.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// edit notes,delete and pin
function NoteItem({ note, onTogglePin, onDelete, onEdit, isEditing }) {
  return (
    <div className={`m-2 p-4 rounded-xl border-l-4 transition-all ${note.pinned ? "border-purple-500" : "border-green-500"} ${isEditing ? "bg-blue-50" : "bg-gray-50"}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">{note.title}</h3>
        <div className="flex gap-1">
          <button 
            onClick={() => onTogglePin(note.id)} 
            className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${note.pinned ? "text-purple-600" : "text-gray-600"}`}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-6 h-5"  fill={note.pinned ? "currentColor" : "none"} />
          </button>
          <button onClick={() => onEdit(note)} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-blue-600" title="Edit">
            <Edit2 className="w-6 h-5"  />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-red-600" title="Delete">
            <Trash2 className="w-6 h-5" />
          </button>
        </div>
      </div>
      {note.content && <p className="text-gray-600 text-sm whitespace-pre-wrap mb-2">{note.content}</p>}
      <div className="text-xs text-gray-400">
        {new Date(note.timestamp).toLocaleDateString()} at {new Date(note.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

export default Home;