"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data);
    } catch {
      showToast("Erro ao carregar publicação", "error");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") setTimeout(() => setToast(null), 3000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/posts/${id}/comments`, { text: commentText });
      setCommentText("");
      showToast("Comentário adicionado!");
      fetchPost();
    } catch {
      showToast("Erro ao adicionar comentário", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setConfirm(null);
    showToast("Removendo...", "loading");
    try {
      await api.delete(`/comments/${commentId}`);
      showToast("Comentário removido!");
      fetchPost();
    } catch {
      showToast("Erro ao remover comentário", "error");
    }
  };

  if (!post) {
    return <div className="text-center py-16 text-gray-400">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Remover este comentário?"
          onConfirm={() => handleDeleteComment(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Post */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
          <Link
            href={`/posts/${post.id}/edit`}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 shrink-0"
          >
            Editar
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {post.author} · {post.category?.name}
        </p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Comentários */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Comentários ({post.comments?.length || 0})
        </h2>

        {/* Formulário inline */}
        <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Escreva um comentário..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {submitting ? "..." : "Enviar"}
          </button>
        </form>

        {/* Lista de comentários */}
        {post.comments?.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum comentário ainda.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <p className="text-sm text-gray-700">{comment.text}</p>
                <button
                  onClick={() => setConfirm({ id: comment.id })}
                  className="text-xs text-red-500 hover:text-red-700 shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link href="/posts" className="text-sm text-blue-600 hover:underline">
          ← Voltar para publicações
        </Link>
      </div>
    </div>
  );
}
