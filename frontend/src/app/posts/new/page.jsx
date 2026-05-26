"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib";
import Toast from "@/components/Toast";

// Componente reutilizado tanto na criação quanto na edição
export function PostForm({ post }) {
  const router = useRouter();
  const isEdit = !!post;

  const [form, setForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    author: post?.author || "",
    categoryId: post?.categoryId || "",
  });
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showToast("Salvando...", "loading");
    try {
      if (isEdit) {
        await api.patch(`/posts/${post.id}`, form);
        showToast("Publicação atualizada!");
      } else {
        await api.post("/posts", form);
        showToast("Publicação criada!");
      }
      setTimeout(() => router.push("/posts"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        "Erro ao salvar publicação";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Editar Publicação" : "Nova Publicação"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            required
            disabled={isEdit}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar publicação"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/posts")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewPostPage() {
  return <PostForm />;
}
