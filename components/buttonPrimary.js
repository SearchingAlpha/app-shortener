"use client";

export default function Button({ onClick, children}) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-700 font-bold transition }"
    >
      {children}
    </button>
  );
}