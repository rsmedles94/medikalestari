import React from "react";
import { MCU_DATA } from "../data";
import MCUDetailClient from "./client";

// ISR: Revalidate setiap 60 detik untuk development
export const revalidate = 60;

export function generateStaticParams() {
  return MCU_DATA.map((item) => ({
    id: item.id,
  }));
}

export default function MCUDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  return <MCUDetailClient params={params} />;
}
