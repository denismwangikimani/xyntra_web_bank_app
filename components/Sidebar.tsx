"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

// We will destructure the user prop from the Sidebar component
const Sidebar = ({ user }: SiderbarProps) => {
  // We will use the usePathname hook to get the current route to determine the active link if the route matches the link route
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-1 pb-4">
          <Image
            width={34}
            height={34}
            src="/icons/logo.svg"
            alt="xyntra logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Xyntra</h1>
        </Link>

        {/* We will map over the sidebarLinks, then return each item as a Link, by passing in the href and key */}
        {sidebarLinks.map((link) => {
          // We will check if the current route matches the link route "/", if it does we will add the active class
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label}
              //we will use cn to conditionally add the active class
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
            >
              <div className="relative size-6">
                <Image
                  fill
                  src={link.imgURL}
                  alt={link.label}
                  //we will turn up the brightness and invert it if the link is active
                  className={cn({
                    "brightness-[3] invert-0": isActive,
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {link.label}
              </p>
            </Link>
          );
        })}

        USER
      </nav>

      <Footer user={user} />
    </section>
  );
};

export default Sidebar;