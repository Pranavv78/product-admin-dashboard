"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addProduct } from "@/services/productService";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Check Login
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // =========================
  // Add Product
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      // Call API
      const data = await addProduct({
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
      });

      // Existing local products
      const existingProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
      );

      // Unique local ID
      const localId = -Date.now();

      // Image
      const productImage =
        image.trim() ||
        "https://dummyjson.com/image/300x200";

      // Complete product
      const newProduct = {
        ...data,

        id: localId,

        title: title.trim(),

        price: Number(price),

        description: description.trim(),

        category: data.category || "other",

        rating:
          typeof data.rating === "number"
            ? data.rating
            : 0,

        stock:
          typeof data.stock === "number"
            ? data.stock
            : 0,

        images: [productImage],

        thumbnail: productImage,
      };

      // Save locally
      localStorage.setItem(
        "addedProducts",
        JSON.stringify([
          ...existingProducts,
          newProduct,
        ])
      );

      // Dashboard
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">

      <h1 className="mb-6 text-3xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4"
      >

        {/* Title */}
        <div>
          <label className="mb-1 block font-medium">
            Product Title
          </label>

          <input
            type="text"
            placeholder="Product title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded border p-3"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-1 block font-medium">
            Price
          </label>

          <input
            type="number"
            placeholder="Price"
            min="0"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full rounded border p-3"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="mb-1 block font-medium">
            Image URL
          </label>

          <input
            type="url"
            placeholder="https://example.com/product.jpg"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            className="w-full rounded border p-3"
          />

          <p className="mt-1 text-sm text-gray-500">
            Enter a direct URL to the product image.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block font-medium">
            Description
          </label>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded border p-3"
            rows={5}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
          >
            {loading
              ? "Adding..."
              : "Add Product"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/")}
            className="rounded bg-gray-200 px-5 py-3 text-black disabled:opacity-50"
          >
            Cancel
          </button>

        </div>

      </form>
    </main>
  );
}