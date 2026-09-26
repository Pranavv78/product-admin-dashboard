"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await loginUser(username, password);

      localStorage.setItem("token", data.accessToken);

      router.push("/");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white">

      {/* =========================
          Header
      ========================= */}
      <header className="h-[64px] border-b border-gray-800 bg-black">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-6">

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Product<span className="text-blue-500">Admin</span>
            </h1>

            <p className="text-[10px] text-gray-500">
              Product Management Dashboard
            </p>
          </div>

          <div className="hidden text-xs text-gray-500 sm:block">
            Admin Portal
          </div>

        </div>
      </header>

      {/* =========================
          Main Section
      ========================= */}
      <section className="flex h-[calc(100vh-64px)] items-center justify-center overflow-hidden px-3 py-3 sm:px-5">

        {/* Main Card */}
        <div className="grid h-full max-h-[560px] w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl lg:grid-cols-2">

          {/* =========================
              LEFT SIDE
          ========================= */}
          <div className="hidden min-h-0 overflow-hidden border-r border-gray-800 bg-gradient-to-br from-gray-950 via-gray-950 to-blue-950/30 p-6 lg:flex lg:flex-col lg:justify-center">

            <div className="w-full">

              {/* Logo */}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
                P
              </div>

              {/* Heading */}
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-blue-500">
                Product Admin Dashboard
              </p>

              <h2 className="mt-1.5 text-3xl font-bold leading-[1.1] xl:text-4xl">
                Manage your
                <span className="block text-blue-500">
                  products with ease.
                </span>
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-5 text-gray-400 xl:text-sm">
                A modern product management dashboard to browse,
                search, organize and manage products efficiently.
              </p>

              {/* =========================
                  Developer Card
              ========================= */}
              <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500">
                  Developed By
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  PRANAV CHAVAN
                </h3>

                <p className="text-xs font-medium text-blue-400">
                  MCA Student
                </p>

                <p className="mt-1 text-[11px] leading-4 text-gray-400">
                  Suryadatta Institute of Management
                  <br />
                  &amp; Information Research (SIMMC)
                </p>

              </div>

              {/* =========================
                  Features
              ========================= */}
              <div className="mt-4 space-y-2.5">

                {/* Feature 1 */}
                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs text-blue-400">
                    ✓
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      Product Management
                    </h3>

                    <p className="text-[10px] text-gray-500">
                      Add, edit and delete products easily.
                    </p>
                  </div>

                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-xs text-green-400">
                    ✓
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      Search &amp; Filter
                    </h3>

                    <p className="text-[10px] text-gray-500">
                      Find products using search and categories.
                    </p>
                  </div>

                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-xs text-purple-400">
                    ✓
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      Product Insights
                    </h3>

                    <p className="text-[10px] text-gray-500">
                      View pricing, ratings, stock and reviews.
                    </p>
                  </div>

                </div>

              </div>

              {/* =========================
                  Tech Stack
              ========================= */}
              <div className="mt-4 border-t border-gray-800 pt-3">

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-gray-600">
                  Built With
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">

                  <span className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[9px] text-gray-400">
                    Next.js
                  </span>

                  <span className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[9px] text-gray-400">
                    React
                  </span>

                  <span className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[9px] text-gray-400">
                    Tailwind CSS
                  </span>

                  <span className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[9px] text-gray-400">
                    Axios
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              RIGHT LOGIN SIDE
          ========================= */}
          <div className="flex min-h-0 items-center justify-center overflow-hidden p-5 sm:p-8">

            <div className="w-full max-w-md">

              {/* Login Heading */}
              <div className="mb-6">

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
                  P
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-gray-500">
                  Sign in to access your Product Admin dashboard.
                </p>

              </div>

              {/* Username */}
              <div className="mb-4">

                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Password */}
              <div className="mb-4">

                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Logging in...

                  </span>
                ) : (
                  "Login"
                )}
              </button>

              {/* Demo Credentials */}
              <div className="mt-5 rounded-lg border border-gray-800 bg-gray-900/50 p-3.5">

                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                  Demo Credentials
                </p>

                <div className="mt-2.5 space-y-1.5 text-xs">

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Username
                    </span>

                    <span className="font-medium text-gray-300">
                      emilys
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Password
                    </span>

                    <span className="font-medium text-gray-300">
                      emilyspass
                    </span>
                  </div>

                </div>

              </div>

              {/* Footer */}
              <p className="mt-5 text-center text-[10px] leading-4 text-gray-600">
                Secure access to your product management workspace.
                <br />
                Developed as an MCA project by Pranav Chavan.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}