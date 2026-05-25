"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface DropdownItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  flag?: string;
}

const DropdownMenuItem = ({ title, href, icon, flag }: DropdownItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-6 py-4 hover:bg-white hover:text-[#00796e] transition-all duration-300 relative overflow-hidden group m-1"
    >
      <div className="flex items-center gap-3">
        {/* FLAG atau ICON */}
        {flag?.startsWith("http") && (
          <Image
            src={flag}
            alt={title}
            width={24}
            height={16}
            className="rounded-sm object-cover shrink-0"
          />
        )}
        {flag && !flag.startsWith("http") && (
          <div className="text-2xl shrink-0 flex items-center justify-center w-6">
            {flag}
          </div>
        )}
        {!flag && icon && (
          <div className="text-white group-hover:text-[#00796e] shrink-0 transition-colors">
            {icon}
          </div>
        )}

        {/* PANAH KIRI */}
        <div className="w-0 opacity-0 -ml-4 group-hover:w-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ease-out">
          <ArrowRight size={18} className="text-[#00796e]" />
        </div>

        {/* TEKS */}
        <span className="text-[14px] text-white group-hover:text-[#00796e] group-hover:font-medium transition-colors duration-300">
          {title}
        </span>
      </div>

      {/* PANAH KANAN */}
      <div className="opacity-100 group-hover:opacity-0 group-hover:translate-x-4 transition-all duration-300 ease-in">
        <ArrowRight
          size={16}
          className="text-white/50 group-hover:text-[#00796e]"
        />
      </div>
    </Link>
  );
};

export default DropdownMenuItem;
