"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib";
import { CategoryForm } from "../../new/page";

export default function EditCategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    api.get(`/categories/${id}`).then(({ data }) => setCategory(data));
  }, [id]);

  if (!category) {
    return <div className="text-center py-16 text-gray-400">Carregando...</div>;
  }

  return <CategoryForm category={category} />;
}
