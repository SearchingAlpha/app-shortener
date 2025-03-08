"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        MyWebsite
      </Link>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-700 transition font-bold"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 rounded-full bg-blue-700 text-white hover:bg-blue-500 transition font-bold"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
