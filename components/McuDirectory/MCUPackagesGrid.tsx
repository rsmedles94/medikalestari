"use client";

import React from "react";
import { MCUPackage } from "@/lib/types";
import { MCUPackageCard } from "./MCUPackageCard";
import { MCUEmptyState } from "./MCUEmptyState";

interface MCUPackagesGridProps {
  packages: MCUPackage[];
  onEdit: (pkg: MCUPackage) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export const MCUPackagesGrid: React.FC<MCUPackagesGridProps> = ({
  packages,
  onEdit,
  onDelete,
  onCreateClick,
}) => {
  if (packages.length === 0) {
    return <MCUEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <MCUPackageCard
          key={pkg.id}
          pkg={pkg}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
