"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const MobileSearchModalDynamic = dynamic(() => import("./MobileSearchModal"), {
  ssr: false,
  loading: () => null,
});

interface MobileSearchModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModalWrapper({
  isOpen,
  onClose,
}: MobileSearchModalWrapperProps) {
  return <MobileSearchModalDynamic isOpen={isOpen} onClose={onClose} />;
}
