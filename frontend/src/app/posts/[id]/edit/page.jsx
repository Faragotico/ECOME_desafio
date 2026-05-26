"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib";
import { PostForm } from "../../new/page";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then(({ data }) => setPost(data));
  }, [id]);

  if (!post) {
    return <div className="text-center py-16 text-gray-400">Carregando...</div>;
  }

  return <PostForm post={post} />;
}
