"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items && items.length > 0) {
      return items;
    }

    const segments = pathname.split("/").filter((segment) => segment);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Beranda", href: "/" }];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav
      className="bg-gray-50 border-b border-gray-200 py-3 px-6"
      aria-label="Breadcrumb"
    >
      <div className="max-w-4xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                  </svg>
                </span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[#004684] hover:text-[#004684] hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
