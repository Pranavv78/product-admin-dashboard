"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProductById,
  deleteProduct,
} from "@/services/productService";

export default function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Protect the page
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // =========================
  // Fetch product
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Get local products
        const addedProducts = JSON.parse(
          localStorage.getItem("addedProducts") || "[]"
        );

        // Get edited products
        const editedProducts = JSON.parse(
          localStorage.getItem("editedProducts") || "[]"
        );

        // Get deleted products
        const deletedProducts = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        // =========================
        // Check deleted product
        // =========================
        if (deletedProducts.includes(String(id))) {
          setError("Product not found");
          return;
        }

        // =========================
        // Check edited product
        // =========================
        const editedProduct = editedProducts.find(
          (product: any) =>
            String(product.id) === String(id)
        );

        if (editedProduct) {
          setProduct(editedProduct);
          return;
        }

        // =========================
        // Check locally added product
        // =========================
        const addedProduct = addedProducts.find(
          (product: any) =>
            String(product.id) === String(id)
        );

        if (addedProduct) {
          setProduct(addedProduct);
          return;
        }

        // =========================
        // Get API product
        // =========================
        const data = await getProductById(id);

        if (!data) {
          setError("Product not found");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error(error);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  // =========================
  // Delete product
  // =========================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      // Get local added products
      const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "[]"
      );

      // Check if this is a locally added product
      const isAddedProduct = addedProducts.some(
        (product: any) =>
          String(product.id) === String(id)
      );

      // =========================
      // Delete local product
      // =========================
      if (isAddedProduct) {
        const updatedProducts = addedProducts.filter(
          (product: any) =>
            String(product.id) !== String(id)
        );

        localStorage.setItem(
          "addedProducts",
          JSON.stringify(updatedProducts)
        );
      }

      // =========================
      // Delete API product
      // =========================
      else {
        await deleteProduct(id);

        // Remember deleted API product
        const deletedProducts = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        if (!deletedProducts.includes(String(id))) {
          deletedProducts.push(String(id));
        }

        localStorage.setItem(
          "deletedProducts",
          JSON.stringify(deletedProducts)
        );
      }

      // =========================
      // Remove edited copy
      // =========================
      const editedProducts = JSON.parse(
        localStorage.getItem("editedProducts") || "[]"
      );

      const updatedEditedProducts =
        editedProducts.filter(
          (product: any) =>
            String(product.id) !== String(id)
        );

      localStorage.setItem(
        "editedProducts",
        JSON.stringify(updatedEditedProducts)
      );

      alert("Product deleted successfully");

      // Return to dashboard
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-black p-6 text-white md:p-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 px-8 py-6 text-center shadow-xl">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />

            <p className="text-gray-400">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <main className="min-h-screen bg-black p-6 text-white md:p-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-500">
              !
            </div>

            <h1 className="text-2xl font-bold">
              Product Not Found
            </h1>

            <p className="mt-3 text-gray-400">
              {error}
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-7 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Product not found
  // =========================
  if (!product) {
    return (
      <main className="min-h-screen bg-black p-6 text-white md:p-10">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-bold">
              Product Not Found
            </h1>

            <button
              onClick={() => router.push("/")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Back to Products
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Product Details
  // =========================
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">

      {/* Back to Products */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-800"
        >
          ← Back to Products
        </button>
      </div>

      {/* Product Main Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">

        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">

          {/* Product Image */}
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-800 bg-gray-900 p-6">

            <img
              src={
                product.thumbnail ||
                product.images?.[0] ||
                "https://dummyjson.com/image/400x400"
              }
              alt={product.title}
              className="max-h-[380px] w-full object-contain"
            />

          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            {/* Category */}
            <span className="mb-4 w-fit rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              {product.category || "Other"}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {product.title}
            </h1>

            {/* Description */}
            <p className="mt-5 leading-7 text-gray-400">
              {product.description ||
                "No description available."}
            </p>

            {/* Product Stats */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {/* Price */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-sm text-gray-500">
                  Price
                </p>

                <p className="mt-1 text-xl font-bold text-green-400">
                  ${product.price}
                </p>
              </div>

              {/* Rating */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-1 text-xl font-bold text-yellow-400">
                  ⭐{" "}
                  {typeof product.rating === "number"
                    ? product.rating
                    : 0}
                </p>
              </div>

              {/* Stock */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <p className="text-sm text-gray-500">
                  Stock
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {typeof product.stock === "number"
                    ? product.stock
                    : 0}
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">

              {/* Edit */}
              <button
                onClick={() =>
                  router.push(
                    `/products/${id}/edit`
                  )
                }
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-blue-700"
              >
                Edit Product
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-red-700"
              >
                Delete Product
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-8 rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-xl md:p-8">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Reviews
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customer feedback for this product
            </p>
          </div>

          {product.reviews &&
            product.reviews.length > 0 && (
              <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-400">
                {product.reviews.length}{" "}
                {product.reviews.length === 1
                  ? "Review"
                  : "Reviews"}
              </span>
            )}
        </div>

        {/* Reviews List */}
        {product.reviews &&
        product.reviews.length > 0 ? (
          <div className="mt-6 space-y-4">

            {product.reviews.map(
              (review: any, index: number) => (
                <div
                  key={`${
                    review.reviewerEmail ||
                    "review"
                  }-${index}`}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
                >

                  {/* Reviewer + Rating */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <p className="font-semibold text-white">
                      {review.reviewerName ||
                        "Anonymous"}
                    </p>

                    <span className="w-fit rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
                      ⭐ {review.rating}
                    </span>

                  </div>

                  {/* Comment */}
                  <p className="mt-4 leading-6 text-gray-400">
                    {review.comment}
                  </p>

                </div>
              )
            )}

          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-8 text-center">
            <p className="text-gray-500">
              No reviews available.
            </p>
          </div>
        )}

      </section>

    </main>
  );
}