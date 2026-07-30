import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import toast from "react-hot-toast";
import { Image, X, ArrowLeft } from "lucide-react";

export default function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !imageFile) {
      toast.error("Please add a caption or image");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (imageFile) formData.append("image", imageFile);
      await createPost(formData);
      toast.success("Post shared! ✨");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[550px] mx-auto px-6 py-6 bg-[#111] border border-white/5 rounded-3xl fade-in mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="create-back-btn"
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-white">New Post</h1>
        <button
          id="create-share-btn"
          onClick={handleSubmit}
          disabled={loading || (!caption.trim() && !imageFile)}
          className="text-sm font-semibold text-pink-400 hover:text-pink-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Sharing..." : "Share"}
        </button>
      </div>

      {/* Image upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all border-2 border-dashed
          ${preview ? "border-transparent" : "border-white/10 hover:border-pink-500/40 bg-white/3"}`}
        style={{ aspectRatio: "1" }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              id="remove-image-btn"
              onClick={(e) => {
                e.stopPropagation();
                setImageFile(null);
                setPreview(null);
              }}
              className="absolute top-3 right-3 p-1.5 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <Image size={36} className="text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">Tap to add photo</p>
            <p className="text-gray-600 text-xs mt-1">
              JPG, JPEG, PNG · Max 2MB
            </p>
          </div>
        )}
        <input
          id="image-input"
          ref={fileRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={handleImage}
          className="hidden"
        />
      </div>

      {/* Caption */}
      <div className="mt-4">
        <textarea
          id="caption-input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows={4}
          maxLength={500}
          className="w-full bg-[#111] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-pink-500/40 transition-all resize-none"
        />
        <p className="text-xs text-gray-600 text-right mt-1">
          {caption.length}/500
        </p>
      </div>

      {/* Submit button */}
      <button
        id="post-submit-btn"
        onClick={handleSubmit}
        disabled={loading || (!caption.trim() && !imageFile)}
        className="w-full mt-4 animated-gradient py-3.5 rounded-2xl text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Sharing your moment..." : "✨ Share Post"}
      </button>
    </div>
  );
}
