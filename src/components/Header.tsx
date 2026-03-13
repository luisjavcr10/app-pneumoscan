"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
 const [menuOpen, setMenuOpen] = useState(false);

 return (
  <header className={styles.header}>
   <div className={`container ${styles.headerInner}`}>
    <Link href="/" className={styles.logo}>
     <div className={styles.logoIcon}>
      <svg
       width="28"
       height="28"
       viewBox="0 0 28 28"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
      >
       <rect width="28" height="28" rx="8" fill="var(--color-primary)" />
       <path
        d="M8 14H20M14 8V20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
       />
      </svg>
     </div>
     <span className={styles.logoText}>PneumoScan</span>
    </Link>

    <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
     <Link
      href="/"
      className={styles.navLink}
      onClick={() => setMenuOpen(false)}
     >
      Inicio
     </Link>
     <Link
      href="#como-funciona"
      className={styles.navLink}
      onClick={() => setMenuOpen(false)}
     >
      Cómo funciona
     </Link>
     <Link
      href="#info"
      className={styles.navLink}
      onClick={() => setMenuOpen(false)}
     >
      Información
     </Link>
    </nav>

    <button
     className={styles.menuButton}
     onClick={() => setMenuOpen(!menuOpen)}
     aria-label="Toggle menu"
    >
     <div
      className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
     >
      <span></span>
      <span></span>
      <span></span>
     </div>
    </button>
   </div>
  </header>
 );
}
