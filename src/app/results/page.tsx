"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import styles from "./page.module.css";

export default function ResultsPage() {
 const router = useRouter();
 const { analysisResult, previewUrl, selectedFile, resetAnalysis } =
  useAnalysis();

 const handleNewAnalysis = () => {
  resetAnalysis();
  router.push("/");
 };

 if (!analysisResult) {
  // If no result, redirect back
  if (typeof window !== "undefined") {
   router.replace("/");
  }
  return null;
 }

 const isPneumonia = analysisResult.diagnosis === "Neumonía";

 return (
  <div className={styles.page}>
   <div className={`container ${styles.content}`}>
    {/* Header section */}
    <div className={styles.resultHeader}>
     <div className={styles.resultBadge}>
      <svg
       width="16"
       height="16"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
      >
       <path d="M9 11l3 3L22 4" />
       <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
      Análisis completado
     </div>
     <h1 className={styles.pageTitle}>Resultados del diagnóstico</h1>
     <p className={styles.pageSubtitle}>
      Análisis realizado el{" "}
      {new Date(analysisResult.analyzedAt).toLocaleString("es-PE", {
       dateStyle: "long",
       timeStyle: "short",
      })}
     </p>
    </div>

    <div className={styles.grid}>
     {/* Left column: Diagnosis card */}
     <div className={styles.mainColumn}>
      {/* Diagnosis Card */}
      <div
       className={`${styles.diagnosisCard} ${
        isPneumonia ? styles.diagnosisDanger : styles.diagnosisSuccess
       }`}
      >
       <div className={styles.diagnosisIconContainer}>
        {isPneumonia ? (
         <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
         >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
         </svg>
        ) : (
         <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
         >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
         </svg>
        )}
       </div>
       <div className={styles.diagnosisContent}>
        <span className={styles.diagnosisLabel}>Diagnóstico</span>
        <h2 className={styles.diagnosisTitle}>
         {isPneumonia ? "Neumonía Detectada" : "Sin Neumonía"}
        </h2>
       </div>
       <div className={styles.confidenceBadge}>
        <span className={styles.confidenceValue}>
         {analysisResult.confidence.toFixed(1)}%
        </span>
        <span className={styles.confidenceLabel}>Confianza</span>
       </div>
      </div>

      {/* Details Card */}
      <div className={styles.card}>
       <h3 className={styles.cardTitle}>
        <svg
         width="18"
         height="18"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-primary)"
         strokeWidth="2"
        >
         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
         <polyline points="14,2 14,8 20,8" />
        </svg>
        Detalles del análisis
       </h3>
       <p className={styles.cardText}>{analysisResult.details}</p>
      </div>

      {/* Recommendations */}
      <div className={styles.card}>
       <h3 className={styles.cardTitle}>
        <svg
         width="18"
         height="18"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-accent)"
         strokeWidth="2"
        >
         <circle cx="12" cy="12" r="10" />
         <line x1="12" y1="16" x2="12" y2="12" />
         <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Recomendaciones
       </h3>
       <ul className={styles.recommendationsList}>
        {analysisResult.recommendations.map((rec, i) => (
         <li key={i} className={styles.recommendationItem}>
          <span className={styles.recDot}></span>
          {rec}
         </li>
        ))}
       </ul>
      </div>
     </div>

     {/* Right column: Image preview */}
     <div className={styles.sideColumn}>
      <div className={styles.card}>
       <h3 className={styles.cardTitle}>
        <svg
         width="18"
         height="18"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-primary)"
         strokeWidth="2"
        >
         <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
         <circle cx="8.5" cy="8.5" r="1.5" />
         <polyline points="21 15 16 10 5 21" />
        </svg>
        Imagen analizada
       </h3>
       {previewUrl && (
        <div className={styles.imagePreview}>
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
          src={previewUrl}
          alt="Radiografía analizada"
          className={styles.resultImage}
         />
        </div>
       )}
       <div className={styles.fileInfo}>
        <span className={styles.fileName}>{selectedFile?.name}</span>
        <span className={styles.fileSize}>
         {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
        </span>
       </div>
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
       <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
       >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
       </svg>
       <p>
        Este resultado es generado por un modelo de IA y debe ser evaluado por
        un profesional médico. No constituye un diagnóstico definitivo.
       </p>
      </div>
     </div>
    </div>

    {/* Action buttons */}
    <div className={styles.actions}>
     <button className={styles.newAnalysisBtn} onClick={handleNewAnalysis}>
      <svg
       width="20"
       height="20"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
      >
       <polyline points="1 4 1 10 7 10" />
       <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
      Nuevo Análisis
     </button>
    </div>
   </div>
  </div>
 );
}
