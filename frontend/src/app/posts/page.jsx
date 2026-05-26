"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts", {
        params: {
          search: search || undefined,
          categoryId: categoryId || undefined,
        },
      });
      setPosts(data);
    } catch {
      showToast("Erro ao carregar publicações", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [search, categoryId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    setConfirm(null);
    showToast("Removendo...", "loading");
    try {
      await api.delete(`/posts/${id}`);
      showToast("Publicação removida!");
      fetchPosts();
    } catch {
      showToast("Erro ao remover publicação", "error");
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Deseja remover esta publicação?"
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Publicações</h1>
        <Link
          href="/posts/new"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          + Nova Publicação
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Nenhuma publicação encontrada.
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-base font-semibold text-blue-700 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {post.author} · {post.category?.name}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setConfirm({ id: post.id })}
                  className="px-3 py-1.5 text-xs bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
