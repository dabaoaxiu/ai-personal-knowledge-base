"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm transition",
        active ? "bg-ink text-white" : "text-stone-600 hover:bg-white hover:text-ink"
      )}
    >
      {label}
    </Link>
  );
}
