"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      showToast("Erro ao carregar categorias", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    setConfirm(null);
    showToast("Removendo...", "loading");
    try {
      await api.delete(`/categories/${id}`);
      showToast("Categoria removida!");
      fetchCategories();
    } catch {
      showToast("Erro ao remover (verifique se há publicações vinculadas)", "error");
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Deseja remover esta categoria?"
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
        <Link
          href="/categories/new"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800"
        >
          + Nova Categoria
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Nenhuma categoria cadastrada.
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-800">{cat.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/categories/${cat.id}/edit`}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => setConfirm({ id: cat.id })}
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
