// src/hooks/useUserPosts.js
import { useState, useEffect } from "react";
import { getUserPosts } from "../services/api";
import toast from "react-hot-toast";

/**
 * Custom hook untuk mengambil posts berdasarkan userId
 * @param {string|number} userId - ID user yang ingin dilihat post-nya
 */
export function useUserPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getUserPosts(userId);
        setPosts(res.data || []);
      } catch (err) {
        toast.error("Failed to load posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]); // Re-fetch otomatis saat userId berubah

  return { posts, loading };
}
