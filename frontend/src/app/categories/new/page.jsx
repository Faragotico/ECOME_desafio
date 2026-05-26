"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib";
import Toast from "@/components/Toast";

// Componente reutilizado tanto na criação quanto na edição
export function CategoryForm({ category }) {
  const router = useRouter();
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

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
        await api.patch(`/categories/${category.id}`, form);
        showToast("Categoria atualizada!");
      } else {
        await api.post("/categories", form);
        showToast("Categoria criada!");
      }
      setTimeout(() => router.push("/categories"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        "Erro ao salvar";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Editar Categoria" : "Nova Categoria"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
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
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar categoria"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewCategoryPage() {
  return <CategoryForm />;
}
