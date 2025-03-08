"use client";

import Link from "next/link";
import ButtonPrimary from "@/components/buttonPrimary";
import ButtonRegular from "@/components/buttonRegular";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        MyWebsite
      </Link>

      {/* Buttons */}
      <div className="flex gap-4">
        <ButtonRegular onClick={() => router.push("/signup")}>Log in</ButtonRegular>
        <ButtonPrimary onClick={() => router.push("/signup")}>Sign up</ButtonPrimary>  
      </div>
    </nav>
  );
}
