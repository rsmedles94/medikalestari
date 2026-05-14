"use client";
import React from "react";
import Image from "next/image";
import NavbarClient from "./NavbarClient";

const Navbar = () => {
  const logoNode = (
    <Image
      src="/logo.png"
      alt="RS Medika Lestari"
      width={130}
      height={25}
      className="object-contain h-auto"
      priority
      style={{ width: "auto" }}
    />
  );

  return <NavbarClient logoNode={logoNode} />;
};

export default Navbar;
