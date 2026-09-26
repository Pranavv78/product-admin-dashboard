"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "@/services/productService";

export default function EditProductPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
   const fetchProduct = async () => {
  try {
    setLoading(true);
    setError("");

    const addedProducts = JSON.parse(
      localStorage.getItem("addedProducts") || "[]"
    );

    const localProduct = addedProducts.find(
      (product: any) => String(product.id) === String(id)
    );

    const data = localProduct || (await getProductById(id));

    setTitle(data.title);
    setPrice(String(data.price));
    setDescription(data.description);
  } catch (error) {
    setError("Product not found");
  } finally {
    setLoading(false);
  }
};

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

try {
  setSaving(true);
  setError("");

  const addedProducts = JSON.parse(
    localStorage.getItem("addedProducts") || "[]"
  );

  const localIndex = addedProducts.findIndex(
    (product: any) => String(product.id) === String(id)
  );

  if (localIndex !== -1) {
    addedProducts[localIndex] = {
      ...addedProducts[localIndex],
      title,
      price: Number(price),
      description,
    };

    localStorage.setItem(
      "addedProducts",
      JSON.stringify(addedProducts)
    );
} else {
  const updatedProduct = await updateProduct(id, {
    title,
    price: Number(price),
    description,
  });

  const editedProducts = JSON.parse(
    localStorage.getItem("editedProducts") || "[]"
  );

  const existingIndex = editedProducts.findIndex(
    (product: any) => String(product.id) === String(id)
  );

  if (existingIndex !== -1) {
    editedProducts[existingIndex] = updatedProduct;
  } else {
    editedProducts.push(updatedProduct);
  }

  localStorage.setItem(
    "editedProducts",
    JSON.stringify(editedProducts)
  );
}

  router.push(`/products/${id}`);
} catch (error) {
      setError("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  if (error && !title) {
    return <p className="p-10 text-red-500">{error}</p>;
  }

  return (
    <main className="p-10">
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4"
      >
        <input
          type="text"
          placeholder="Product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-3"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border p-3"
          rows={5}
        />

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}