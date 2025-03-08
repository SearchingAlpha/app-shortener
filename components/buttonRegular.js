"use client";

export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-full bg-gray-100 text-black hover:bg-gray-300 font-bold transition "
    >
      {children}
    </button>
  );
}