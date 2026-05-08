"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CallCenter = () => {
  const contactMenus = [
    {
      id: "cs",
      title: "HUBUNGI CUSTOMER CARE",
      action: "https://wa.me/6282246232527",
    },
    {
      id: "email",
      title: "EMAIL RESMI MARKETING",
      action: "mailto:marketing@rsmedikalestari.com",
    },
    {
      id: "lokasi",
      title: "LIHAT LOKASI RUMAH SAKIT",
      action: "https://maps.app.goo.gl/19qWtLaQQXXN7d5W9",
    },
  ];

  return (
    <section className="relative w-full min-h-[550px] flex items-center overflow-hidden border-t border-slate-100 ">
      <div className="absolute inset-0">
        <Image
          src="/cs.jpg"
          alt="Hubungi Kami"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="relative z-20 max-w-290 mx-auto px-6 md:px-10 w-full grid grid-cols-1 md:grid-cols-2 gap-16 py-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tighter leading-[1.1] mb-6">
            Hubungi Pusat <br /> Informasi Kami
          </h2>
          <p className="text-white max-w-lg text-sm md:text-base leading-relaxed opacity-90">
            Tim Layanan Pelanggan kami siap melayani pertanyaan, keluhan, maupun
            panduan akses layanan Rumah Sakit Medika Lestari.
          </p>
        </motion.div>
        <div className="flex flex-col justify-center gap-10 md:pl-10">
          {contactMenus.map((menu, index) => (
            <motion.a
              key={menu.id}
              href={menu.action}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group flex flex-col w-full transition-all duration-300 hover:pl-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-white transition-colors group-hover:text-white">
                  {menu.title}
                </span>
                <svg
                  className="w-5 h-5 text-white/50 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="w-full h-[1px] bg-white/20 transition-all duration-300 group-hover:bg-white/60" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CallCenter;
