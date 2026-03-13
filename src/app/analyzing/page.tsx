"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import styles from "./page.module.css";

export default function AnalyzingPage() {
 const router = useRouter();
 const { selectedFile, previewUrl, startAnalysis } = useAnalysis();
 const [progress, setProgress] = useState(0);
 const [statusText, setStatusText] = useState("Preparando análisis...");

 useEffect(() => {
  if (!selectedFile) {
   router.replace("/");
   return;
  }

  const statuses = [
   "Preparando análisis...",
   "Cargando imagen al servidor...",
   "Procesando con modelo de IA...",
   "Analizando patrones pulmonares...",
   "Generando diagnóstico...",
  ];

  let step = 0;
  const interval = setInterval(() => {
   step++;
   const pct = Math.min((step / 5) * 100, 100);
   setProgress(pct);

   if (step < statuses.length) {
    setStatusText(statuses[step]);
   }

   if (step >= 5) {
    clearInterval(interval);
    startAnalysis();
    setTimeout(() => {
     router.push("/results");
    }, 400);
   }
  }, 700);

  return () => clearInterval(interval);
 }, [selectedFile, router, startAnalysis]);

 if (!selectedFile) return null;

 return (
  <div className={styles.page}>
   <div className={styles.content}>
    {/* Image with scan effect */}
    <div className={styles.imageContainer}>
     {previewUrl && (
      <>
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={previewUrl} alt="Analizando" className={styles.image} />
       <div className={styles.scanLine}></div>
       <div className={styles.scanOverlay}></div>
      </>
     )}
     <div className={styles.pulseRing}></div>
     <div className={styles.pulseRing2}></div>
    </div>

    {/* Status */}
    <div className={styles.statusContainer}>
     <h2 className={styles.title}>Analizando radiografía</h2>
     <p className={styles.status}>{statusText}</p>

     {/* Progress bar */}
     <div className={styles.progressBarContainer}>
      <div className={styles.progressBarTrack}>
       <div
        className={styles.progressBarFill}
        style={{ width: `${progress}%` }}
       ></div>
      </div>
      <span className={styles.progressPercent}>{Math.round(progress)}%</span>
     </div>

     {/* File info */}
     <div className={styles.fileInfo}>
      <svg
       width="16"
       height="16"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
      >
       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
       <polyline points="14,2 14,8 20,8" />
      </svg>
      <span>{selectedFile.name}</span>
     </div>
    </div>
   </div>
  </div>
 );
}
