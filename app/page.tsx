"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getProducts,
  getCategories,
} from "@/services/productService";

import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  images: string[];
  thumbnail?: string;
  description?: string;
};

function ProductsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // =========================
  // Protect page
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // =========================
  // Products state
  // =========================
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  // =========================
  // Page
  // =========================
  const urlPage = Number(searchParams.get("page"));

  const initialPage =
    Number.isInteger(urlPage) && urlPage >= 1
      ? urlPage
      : 1;

  const [page, setPage] = useState(initialPage);

  // =========================
  // Page size
  // =========================
  const urlLimit = Number(searchParams.get("limit"));

  const initialLimit =
    [10, 20, 50].includes(urlLimit)
      ? urlLimit
      : 10;

  const [limit, setLimit] = useState(initialLimit);

  // =========================
  // Search
  // =========================
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  // =========================
  // Category
  // =========================
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [categories, setCategories] = useState<
    { slug: string; name: string }[]
  >([]);

  // =========================
  // Sort
  // =========================
  const [sort, setSort] = useState(
    searchParams.get("sort") || ""
  );

  // =========================
  // Pagination calculations
  // =========================
  const skip = (page - 1) * limit;

  const startItem =
    total === 0 ? 0 : skip + 1;

  const endItem = Math.min(
    skip + limit,
    total
  );

  const totalPages = Math.ceil(total / limit);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // =========================
  // Change page
  // =========================
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    router.push(`/?${params.toString()}`);
    setPage(newPage);
  };

  // =========================
  // Correct invalid page
  // =========================
  useEffect(() => {
    if (total === 0) {
      return;
    }

    const maxPage = Math.ceil(total / limit);

    if (page > maxPage) {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      params.set("page", String(maxPage));

      router.replace(`/?${params.toString()}`);

      setPage(maxPage);
    }
  }, [
    page,
    limit,
    total,
    searchParams,
    router,
  ]);

  // =========================
  // Correct invalid page size
  // =========================
  useEffect(() => {
    const urlLimit = Number(
      searchParams.get("limit")
    );

    if (![10, 20, 50].includes(urlLimit)) {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      params.set("limit", "10");
      params.set("page", "1");

      router.replace(`/?${params.toString()}`);

      setLimit(10);
      setPage(1);
    }
  }, [searchParams, router]);

  // =========================
  // Load categories
  // =========================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(
          "Failed to load categories",
          error
        );
      }
    };

    loadCategories();
  }, []);

  // =========================
  // Fetch products
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    const fetchProductsWithCancel = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------
        // Read local storage
        // ---------------------------------
        const addedProducts: Product[] = JSON.parse(
          localStorage.getItem("addedProducts") || "[]"
        );

        const deletedProducts: string[] = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        const editedProducts: Product[] = JSON.parse(
          localStorage.getItem("editedProducts") || "[]"
        );

        // ---------------------------------
        // Remove deleted local products
        // ---------------------------------
        let activeAddedProducts =
          addedProducts.filter(
            (product) =>
              !deletedProducts.includes(
                String(product.id)
              )
          );

        // ---------------------------------
        // Apply local search
        // ---------------------------------
        if (search.trim()) {
          const searchText =
            search.trim().toLowerCase();

          activeAddedProducts =
            activeAddedProducts.filter(
              (product) =>
                product.title
                  .toLowerCase()
                  .includes(searchText) ||
                product.category
                  .toLowerCase()
                  .includes(searchText)
            );
        }

        // ---------------------------------
        // Apply local category
        // ---------------------------------
        if (category) {
          activeAddedProducts =
            activeAddedProducts.filter(
              (product) =>
                product.category === category
            );
        }

        // ---------------------------------
        // Apply edited versions
        // ---------------------------------
        activeAddedProducts =
          activeAddedProducts.map((product) => {
            const editedProduct =
              editedProducts.find(
                (edited) =>
                  String(edited.id) ===
                  String(product.id)
              );

            return editedProduct || product;
          });

        // ---------------------------------
        // Apply local sorting
        // ---------------------------------
        const sortProducts = (
          productList: Product[]
        ) => {
          const sorted = [...productList];

          switch (sort) {
            case "price-asc":
              sorted.sort(
                (a, b) => a.price - b.price
              );
              break;

            case "price-desc":
              sorted.sort(
                (a, b) => b.price - a.price
              );
              break;

            case "rating-asc":
              sorted.sort(
                (a, b) => a.rating - b.rating
              );
              break;

            case "rating-desc":
              sorted.sort(
                (a, b) => b.rating - a.rating
              );
              break;

            case "title-asc":
              sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
              );
              break;

            case "title-desc":
              sorted.sort((a, b) =>
                b.title.localeCompare(a.title)
              );
              break;

            default:
              break;
          }

          return sorted;
        };

        activeAddedProducts =
          sortProducts(activeAddedProducts);

        // ---------------------------------
        // Calculate API pagination
        // ---------------------------------
        const apiSkip = Math.max(
          0,
          skip - activeAddedProducts.length
        );

        const apiLimit =
          limit + activeAddedProducts.length;

        // ---------------------------------
        // Get API products
        // ---------------------------------
        const data = await getProducts(
          apiLimit,
          apiSkip,
          search,
          category,
          sort,
          controller.signal
        );

        // ---------------------------------
        // Remove deleted API products
        // ---------------------------------
        let filteredApiProducts =
          data.products.filter(
            (product: Product) =>
              !deletedProducts.includes(
                String(product.id)
              )
          );

        // ---------------------------------
        // Apply edited API products
        // ---------------------------------
        filteredApiProducts =
          filteredApiProducts.map(
            (product: Product) => {
              const editedProduct =
                editedProducts.find(
                  (edited) =>
                    String(edited.id) ===
                    String(product.id)
                );

              return editedProduct || product;
            }
          );

        // ---------------------------------
        // Combine local + API
        // ---------------------------------
        let combinedProducts = [
          ...activeAddedProducts,
          ...filteredApiProducts,
        ];

        // ---------------------------------
        // Apply final sorting
        // ---------------------------------
        combinedProducts =
          sortProducts(combinedProducts);

        // ---------------------------------
        // Get current page
        // ---------------------------------
        const pageProducts =
          combinedProducts.slice(0, limit);

        setProducts(pageProducts);

        // ---------------------------------
        // Count deleted API products
        // ---------------------------------
        const deletedApiCount =
          data.products.filter(
            (product: Product) =>
              deletedProducts.includes(
                String(product.id)
              )
          ).length;

        // ---------------------------------
        // Total
        // ---------------------------------
        setTotal(
          data.total -
            deletedApiCount +
            activeAddedProducts.length
        );
      } catch (error: any) {
        // Ignore cancelled requests
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(error);
        setError("Failed to load products.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProductsWithCancel();

    return () => {
      controller.abort();
    };
  }, [
    page,
    limit,
    search,
    category,
    sort,
  ]);

  // =========================
  // Search debounce
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch =
        searchParams.get("search") || "";

      if (searchInput === currentSearch) {
        return;
      }

      const params = new URLSearchParams(
        searchParams.toString()
      );

      if (searchInput.trim()) {
        params.set(
          "search",
          searchInput.trim()
        );
      } else {
        params.delete("search");
      }

      // Search starts from page 1
      params.set("page", "1");

      // Search and category cannot coexist
      params.delete("category");

      router.push(`/?${params.toString()}`);

      setSearch(searchInput.trim());
      setCategory("");
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    searchInput,
    searchParams,
    router,
  ]);

  // =========================
  // Render
  // =========================
  return (
    <main className="p-10">

      {/* Top Header */}
      <div className="flex flex-col gap-6 border-b border-gray-800 pb-8">

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Products
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage and explore your products
          </p>
        </div>

        {/* Add Product */}
        <div>
          <Link
            href="/products/add"
            className="inline-flex items-center rounded-lg bg-green-600 px-5 py-3 font-medium text-white shadow-lg transition hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">

          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              const value = e.target.value;

              const params = new URLSearchParams(
                searchParams.toString()
              );

              if (value) {
                params.set("category", value);
              } else {
                params.delete("category");
              }

              // Search and category cannot coexist
              params.delete("search");

              params.set("page", "1");

              router.push(`/?${params.toString()}`);

              setCategory(value);
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-white outline-none transition hover:border-gray-500 focus:border-blue-500"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item.slug}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              const value = e.target.value;

              const params = new URLSearchParams(
                searchParams.toString()
              );

              if (value) {
                params.set("sort", value);
              } else {
                params.delete("sort");
              }

              params.set("page", "1");

              router.push(`/?${params.toString()}`);

              setSort(value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-white outline-none transition hover:border-gray-500 focus:border-blue-500"
          >
            <option value="">
              Default Sorting
            </option>

            <option value="price-asc">
              Price: Low → High
            </option>

            <option value="price-desc">
              Price: High → Low
            </option>

            <option value="rating-asc">
              Rating: Low → High
            </option>

            <option value="rating-desc">
              Rating: High → Low
            </option>

            <option value="title-asc">
              Title: A to Z
            </option>

            <option value="title-desc">
              Title: Z to A
            </option>
          </select>
        </div>

        {/* Search */}
        <div className="flex w-full max-w-2xl gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-white outline-none placeholder:text-gray-500 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);

              const params = new URLSearchParams(
                searchParams.toString()
              );

              params.delete("search");
              params.set("page", "1");

              router.push(`/?${params.toString()}`);
            }}
            className="rounded-lg bg-gray-800 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
          >
            Clear
          </button>
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-6">
          Loading...
        </p>
      )}

      {/* Error */}
      {error ? (
        <div className="py-10 text-center">
          <p className="mb-4 text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="rounded bg-blue-600 px-5 py-2 text-white"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 && !loading ? (
        /* Empty */
        <p className="py-10 text-center text-gray-500">
          No products found.
        </p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse border">

              <thead>
               <tr className="bg-gray-900 text-white text-left">

                  <th className="border p-3">
                    Image
                  </th>

                  <th className="border p-3">
                    Title
                  </th>

                  <th className="border p-3">
                    Category
                  </th>

                  <th className="border p-3">
                    Price
                  </th>

                  <th className="border p-3">
                    Rating
                  </th>

                  <th className="border p-3">
                    Stock
                  </th>

                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>

                    <td className="w-24 border p-3">
                      <img
                        src={
                          product.thumbnail ||
                          product.images?.[0] ||
                          "https://dummyjson.com/image/100x100"
                        }
                        alt={product.title}
                        className="h-16 w-16 rounded object-contain"
                      />
                    </td>

                    <td className="border p-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-blue-600"
                      >
                        {product.title}
                      </Link>
                    </td>

                    <td className="border p-3">
                      {product.category}
                    </td>

                    <td className="border p-3">
                      ${product.price}
                    </td>

                    <td className="border p-3">
                      ⭐ {product.rating}
                    </td>

                    <td className="border p-3">
                      {product.stock}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}

      {/* Pagination information */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-950 p-5 shadow-lg">
        <div className="grid gap-5 sm:grid-cols-3">

          {/* Current Page */}
          <div>
            <p className="text-sm text-gray-400">
              Current Page
            </p>

            <p className="mt-1 text-xl font-semibold text-white">
              {page}
            </p>
          </div>

          {/* Showing */}
          <div>
            <p className="text-sm text-gray-400">
              Showing
            </p>

            <p className="mt-1 text-xl font-semibold text-white">
              {startItem}–{endItem}
              <span className="ml-1 text-sm font-normal text-gray-400">
                of {total}
              </span>
            </p>
          </div>

          {/* Products Per Page */}
          <div>
            <p className="mb-2 text-sm text-gray-400">
              Products per page
            </p>

            <select
              value={limit}
              onChange={(e) => {
                const value = Number(
                  e.target.value
                );

                const params = new URLSearchParams(
                  searchParams.toString()
                );

                params.set(
                  "limit",
                  String(value)
                );

                params.set("page", "1");

                router.push(
                  `/?${params.toString()}`
                );

                setLimit(value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white outline-none transition focus:border-blue-500"
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* Pagination buttons */}
      <div className="mt-6 flex flex-wrap gap-3">

        {/* Previous */}
        <button
          onClick={() =>
            changePage(page - 1)
          }
          disabled={page === 1}
          className="rounded bg-gray-200 px-4 py-2 text-black disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex flex-wrap gap-2">
          {pageNumbers.map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() =>
                  changePage(pageNumber)
                }
                className={`rounded px-3 py-2 ${
                  page === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() =>
            changePage(page + 1)
          }
          disabled={
            page === totalPages ||
            totalPages === 0
          }
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black p-10 text-white">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
              <p className="text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </main>
      }
    >
      <ProductsDashboard />
    </Suspense>
  );
}
