import React, { useState, useEffect,useMemo,useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput"; 
import ActionButton from "../components/ActionButton"; 
import { toast } from "react-hot-toast";  

const defaultValues = {
  title: "",
  content: "",
  tags: "",
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onSubmit = (data) => {
    const tagsArr = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editId !== null) {
      setNotes((ns) =>
        ns.map((n) =>
          n.id === editId
            ? {
                ...data,
                tags: tagsArr,
                id: editId,
                favorite: n.favorite || false,
              }
            : n
        )
      );
      toast.success("Note updated successfully!");
      setEditId(null);
    } else {
      setNotes((ns) => [
        {
          ...data,
          tags: tagsArr,
          id: Date.now().toString(),
          favorite: false,
          createdAt: Date.now(),
        },
        ...ns,
      ]);
      toast.success("Note added successfully!");
    }

    reset(defaultValues);
  };

const handleEdit = useCallback(
  (note) => {
    setEditId(note.id);
    setValue("title", note.title);
    setValue("content", note.content);
    setValue("tags", note.tags.join(", "));
    toast("Edit mode enabled for note", { icon: "📝" });
  },
  [setValue]
);

const handleDelete = useCallback(
  (id) => {
    setNotes((ns) => ns.filter((n) => n.id !== id));
    if (editId === id) {
      reset(defaultValues);
      setEditId(null);
    }
    toast.error("Note deleted!");
  },
  [editId, reset]
);

const handleFavorite = useCallback((id) => {
  setNotes((ns) =>
    ns.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n))
  );
}, []);

  // Filter and sort notes
const filteredNotes = useMemo(() => {
  const searchLower = search.toLowerCase();
  return notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(searchLower) ||
        n.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
    .sort((a, b) => {
      if (sort === "newest") return b.createdAt - a.createdAt;
      if (sort === "oldest") return a.createdAt - b.createdAt;
      return 0;
    });
}, [notes, search, sort]);

  return (
    <div className="bg-secondary text-primarytext min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Notes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Form */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7  h-fit   bg-secondary bg-opacity-10  rounded "
          >
            <FormInput
              label="Title"
              name="title"
              register={register}
              required
              errors={errors}
              maxLength={50}
              validation={{
                required: "Title is required",
                maxLength: {
                  value: 50,
                  message: "Max 50 characters",
                },
              }}
            />

            <div>
              <label className="block font-semibold">Content *</label>
              <textarea
                {...register("content", {
                  required: "Content is required",
                  minLength: {
                    value: 10,
                    message: "Content must be at least 10 characters",
                  },
                })}
                className="w-full text-black border rounded p-2"
                rows={4}
              />
              {errors.content && (
                <div className="text-red-500 text-sm">
                  {errors.content.message}
                </div>
              )}
            </div>
            <FormInput
              label="Tags (comma separated)"
              name="tags"
              register={register}
              errors={errors}
              placeholder="e.g. work, personal"
            />
            <button
              type="submit"
              className="bg-primary text-secondarytext px-4 py-2 rounded mt-2"
            >
              {editId ? "Update Note" : "Add Note"}
            </button>
            {editId && (
              <button
                type="button"
                className="ml-2 px-4 py-2 rounded bg-gray-300"
                onClick={() => {
                  reset(defaultValues);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {/* Right: Filters and Notes List */}
          <div>
            <div className="flex flex-col md:flex-row md:justify-between items-stretch md:items-center mb-4 gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or tag..."
                className="border text-black rounded p-2 w-full md:w-1/2"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border text-black rounded p-1 w-full md:w-1/3"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="grid gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded p-4 shadow relative"
                >
                  <button
                    className="absolute top-2 right-2"
                    onClick={() => handleFavorite(note.id)}
                    title={
                      note.favorite ? "Unmark Favorite" : "Mark as Favorite"
                    }
                  >
                    {note.favorite ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-400" />
                    )}
                  </button>
                  <div className="font-bold text-black text-lg mb-1">
                    {note.title}
                  </div>
                  <div className="text-black mb-2 whitespace-pre-line">
                    {note.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-black text-white px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <ActionButton
                      label="Edit"
                      onClick={() => handleEdit(note)}
                      color="yellow"
                    />

                    <ActionButton
                      label="Delete"
                      onClick={() => handleDelete(note.id)}
                      color="red"
                    />
                  </div>
                </div>
              ))}
            </div>
            {filteredNotes.length === 0 && (
              <div className="text-center text-primarytext mt-8">
                No notes found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;