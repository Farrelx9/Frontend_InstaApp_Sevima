import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Sparkles, UploadCloud, X, Crop } from "lucide-react";
import { motion } from "framer-motion";

/**
 * cropImageToSquare — uses HTML5 Canvas API to crop the center of
 * any photo (portrait, landscape, or square) to an exact 1:1 square,
 * then returns a new square File + a data-URL for preview.
 *
 * Resolution: 1080×1080 (Instagram standard)
 */
function cropImageToSquare(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const OUTPUT_SIZE = 1080; // Instagram-standard resolution

      // Determine center-crop coordinates
      const srcSize = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - srcSize) / 2;
      const sy = (img.naturalHeight - srcSize) / 2;

      // Draw onto canvas
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        sx,
        sy,
        srcSize,
        srcSize,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas conversion failed"));
          const croppedFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".jpg"),
            {
              type: "image/jpeg",
            },
          );
          resolve({
            file: croppedFile,
            previewUrl: canvas.toDataURL("image/jpeg", 0.92),
          });
        },
        "image/jpeg",
        0.92,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
}

export default function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropping, setCropping] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Only JPG or PNG files allowed");
      return;
    }

    // Validate raw file size (2MB before crop)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }

    // Crop to 1080×1080 square using Canvas API
    setCropping(true);
    try {
      const { file: croppedFile, previewUrl } = await cropImageToSquare(file);
      setImageFile(croppedFile);
      setPreview(previewUrl);
      toast.success("Photo cropped to square ✂️", {
        duration: 1800,
        icon: "🟥",
      });
    } catch (err) {
      toast.error("Failed to process image");
      console.error(err);
    } finally {
      setCropping(false);
      // Reset input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!caption.trim() && !imageFile) {
      toast.error("Add a caption or image");
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
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-[640px] mx-auto"
    >
      <div className="bg-[#0e0e0e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <button
            id="create-back-btn"
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-pink-400" />
            <h1 className="text-sm font-bold text-white tracking-tight">
              Create New Post
            </h1>
          </div>
          <motion.button
            id="create-share-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading || (!caption.trim() && !imageFile)}
            className="text-xs font-bold text-pink-400 hover:text-pink-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20"
          >
            {loading ? "Sharing…" : "Share"}
          </motion.button>
        </div>

        {/* ── Image Upload Area (1:1 Square) ── */}
        <div
          className={`
            relative w-full aspect-square bg-[#0a0a0a] overflow-hidden cursor-pointer
            border-b border-white/10
            flex items-center justify-center
            ${!preview ? "hover:bg-white/5 transition-colors" : ""}
          `}
          onClick={() => !preview && !cropping && fileRef.current?.click()}
        >
          {/* Dashed border overlay when empty */}
          {!preview && !cropping && (
            <div className="absolute inset-4 border-2 border-dashed border-white/15 rounded-2xl pointer-events-none" />
          )}

          {/* Preview image (always fills square) */}
          {preview && (
            <>
              <img
                src={preview}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover block"
              />
              {/* Remove button */}
              <button
                id="remove-image-btn"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 p-2 bg-black/70 rounded-full hover:bg-black transition-colors text-white shadow-xl z-10"
              >
                <X size={16} />
              </button>
              {/* Crop badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <Crop size={11} />
                1080 × 1080
              </div>
            </>
          )}

          {/* Cropping spinner */}
          {cropping && (
            <div className="flex flex-col items-center gap-3 text-center z-10">
              <div className="spinner" />
              <p className="text-white text-sm font-medium">
                Cropping to square…
              </p>
            </div>
          )}

          {/* Empty state (no image, not cropping) */}
          {!preview && !cropping && (
            <div className="flex flex-col items-center gap-3 text-center px-6 z-10">
              <div className="p-5 rounded-full bg-gradient-to-tr from-pink-500/20 to-amber-500/20 border border-pink-500/25">
                <UploadCloud
                  size={38}
                  className="text-pink-400 animate-bounce"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  Tap to upload a photo
                </p>
                <p className="text-gray-500 text-xs mt-1">JPG, PNG · Max 5MB</p>
                <p className="text-pink-400/80 text-xs mt-1 flex items-center justify-center gap-1">
                  <Crop size={11} />
                  Will be auto-cropped to 1080×1080 square
                </p>
              </div>
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

        {/* ── Caption & Submit ── */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Caption textarea */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Caption
            </label>
            <textarea
              id="caption-input"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption… What's on your mind?"
              rows={4}
              maxLength={500}
              className="
                w-full bg-[#141414] border border-white/10 rounded-2xl
                px-4 py-3 text-white text-sm placeholder-gray-600
                focus:border-pink-500/50 focus:outline-none
                transition-all resize-none leading-relaxed
              "
            />
            <p className="text-[11px] text-gray-600 text-right mt-1">
              {caption.length}/500
            </p>
          </div>

          {/* Submit button */}
          <motion.button
            id="post-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || cropping || (!caption.trim() && !imageFile)}
            className="
              w-full animated-gradient py-3.5 rounded-2xl
              text-white font-bold text-sm shadow-xl
              hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
            "
          >
            {loading ? "Sharing your moment…" : "✨ Share Post"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
