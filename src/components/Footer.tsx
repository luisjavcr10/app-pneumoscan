import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
 return (
  <footer className={styles.footer}>
   <div className={`container ${styles.footerInner}`}>
    <div className={styles.brand}>
     <div className={styles.logoIcon}>
      <svg
       width="24"
       height="24"
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
     <span className={styles.brandName}>PneumoScan</span>
    </div>

    <p className={styles.disclaimer}>
     ⚕️ Este software es una herramienta de apoyo al diagnóstico. Los resultados
     deben ser evaluados por un profesional médico calificado. No reemplaza el
     criterio clínico.
    </p>

    <p className={styles.copyright}>
     © {new Date().getFullYear()} PneumoScan · Proyecto académico
    </p>
   </div>
  </footer>
 );
}
