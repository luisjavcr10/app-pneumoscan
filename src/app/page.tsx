"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import styles from "./page.module.css";

export default function HomePage() {
 const router = useRouter();
 const { selectedFile, previewUrl, setSelectedFile, setPreviewUrl } =
  useAnalysis();
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [isDragging, setIsDragging] = useState(false);

 const handleFile = useCallback(
  (file: File) => {
   if (!file.type.startsWith("image/")) return;
   setSelectedFile(file);
   const url = URL.createObjectURL(file);
   setPreviewUrl(url);
  },
  [setSelectedFile, setPreviewUrl],
 );

 const handleDrop = useCallback(
  (e: React.DragEvent) => {
   e.preventDefault();
   setIsDragging(false);
   const file = e.dataTransfer.files[0];
   if (file) handleFile(file);
  },
  [handleFile],
 );

 const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
 }, []);

 const handleDragLeave = useCallback(() => {
  setIsDragging(false);
 }, []);

 const handleInputChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (file) handleFile(file);
  },
  [handleFile],
 );

 const handleAnalyze = () => {
  if (selectedFile) {
   router.push("/analyzing");
  }
 };

 return (
  <div className={styles.page}>
   {/* Hero Section */}
   <section className={styles.hero}>
    <div className={`container ${styles.heroContent}`}>
     <div className={styles.heroBadge}>
      <span className={styles.badgeDot}></span>
      Powered by Inteligencia Artificial
     </div>
     <h1 className={styles.heroTitle}>
      Diagnóstico de <span className={styles.heroHighlight}>neumonía</span> con
      análisis de imágenes
     </h1>
     <p className={styles.heroSubtitle}>
      Sube una radiografía de tórax y obtén un análisis predictivo en segundos.
      Tecnología de deep learning al servicio de la salud.
     </p>
    </div>
   </section>

   {/* Upload Section */}
   <section className={styles.uploadSection}>
    <div className={`container ${styles.uploadContainer}`}>
     <div
      className={`${styles.dropzone} ${isDragging ? styles.dropzoneDragging : ""} ${
       previewUrl ? styles.dropzoneHasFile : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !previewUrl && fileInputRef.current?.click()}
     >
      <input
       ref={fileInputRef}
       type="file"
       accept="image/*"
       onChange={handleInputChange}
       className={styles.fileInput}
       id="file-upload"
      />

      {previewUrl ? (
       <div className={styles.previewContainer}>
        <div className={styles.previewImageWrapper}>
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
          src={previewUrl}
          alt="Radiografía cargada"
          className={styles.previewImage}
         />
        </div>
        <div className={styles.previewInfo}>
         <div className={styles.previewFileIcon}>
          <svg
           width="20"
           height="20"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
          >
           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
           <polyline points="14,2 14,8 20,8" />
          </svg>
         </div>
         <div className={styles.previewDetails}>
          <span className={styles.previewName}>{selectedFile?.name}</span>
          <span className={styles.previewSize}>
           {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
         </div>
         <button
          className={styles.changeFileBtn}
          onClick={(e) => {
           e.stopPropagation();
           fileInputRef.current?.click();
          }}
         >
          Cambiar
         </button>
        </div>
       </div>
      ) : (
       <div className={styles.dropzoneContent}>
        <div className={styles.uploadIconWrapper}>
         <svg
          className={styles.uploadIcon}
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
         >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17,8 12,3 7,8" />
          <line x1="12" y1="3" x2="12" y2="15" />
         </svg>
        </div>
        <h3 className={styles.dropzoneTitle}>Arrastra tu radiografía aquí</h3>
        <p className={styles.dropzoneText}>
         o haz clic para seleccionar un archivo
        </p>
        <div className={styles.dropzoneFormats}>
         <span>JPG</span>
         <span>PNG</span>
         <span>DICOM</span>
        </div>
       </div>
      )}
     </div>

     <button
      className={`${styles.analyzeButton} ${selectedFile ? styles.analyzeButtonActive : ""}`}
      onClick={handleAnalyze}
      disabled={!selectedFile}
     >
      <svg
       width="20"
       height="20"
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="2"
      >
       <circle cx="11" cy="11" r="8" />
       <path d="M21 21l-4.35-4.35" />
      </svg>
      Analizar Imagen
     </button>
    </div>
   </section>

   {/* How It Works */}
   <section className={styles.howItWorks} id="como-funciona">
    <div className="container">
     <h2 className={styles.sectionTitle}>Cómo funciona</h2>
     <p className={styles.sectionSubtitle}>
      Tres sencillos pasos para obtener un diagnóstico predictivo
     </p>

     <div className={styles.stepsGrid}>
      <div className={styles.stepCard}>
       <div className={styles.stepNumber}>1</div>
       <div className={styles.stepIconWrap}>
        <svg
         width="32"
         height="32"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-primary)"
         strokeWidth="1.5"
        >
         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
         <polyline points="17,8 12,3 7,8" />
         <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
       </div>
       <h3 className={styles.stepTitle}>Sube la imagen</h3>
       <p className={styles.stepDesc}>
        Carga una radiografía de tórax en formato JPG, PNG o DICOM desde tu
        dispositivo.
       </p>
      </div>

      <div className={styles.stepCard}>
       <div className={styles.stepNumber}>2</div>
       <div className={styles.stepIconWrap}>
        <svg
         width="32"
         height="32"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-primary)"
         strokeWidth="1.5"
        >
         <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
         <line x1="8" y1="21" x2="16" y2="21" />
         <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
       </div>
       <h3 className={styles.stepTitle}>Análisis con IA</h3>
       <p className={styles.stepDesc}>
        Nuestro modelo de deep learning analiza la imagen buscando patrones de
        neumonía.
       </p>
      </div>

      <div className={styles.stepCard}>
       <div className={styles.stepNumber}>3</div>
       <div className={styles.stepIconWrap}>
        <svg
         width="32"
         height="32"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-primary)"
         strokeWidth="1.5"
        >
         <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
         <polyline points="14,2 14,8 20,8" />
         <line x1="16" y1="13" x2="8" y2="13" />
         <line x1="16" y1="17" x2="8" y2="17" />
         <polyline points="10,9 9,9 8,9" />
        </svg>
       </div>
       <h3 className={styles.stepTitle}>Obtén resultados</h3>
       <p className={styles.stepDesc}>
        Recibe un diagnóstico con nivel de confianza, detalles y
        recomendaciones.
       </p>
      </div>
     </div>
    </div>
   </section>

   {/* Info Section */}
   <section className={styles.infoSection} id="info">
    <div className="container">
     <div className={styles.infoGrid}>
      <div className={styles.infoCard}>
       <div className={styles.infoIconWrap}>
        <svg
         width="28"
         height="28"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-accent)"
         strokeWidth="1.5"
        >
         <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
       </div>
       <h3 className={styles.infoTitle}>¿Qué es la neumonía?</h3>
       <p className={styles.infoText}>
        La neumonía es una infección del pulmón causada por bacterias, virus u
        hongos. Puede adquirirse en la comunidad o en centros sanitarios, y su
        detección temprana es clave para un tratamiento efectivo.
       </p>
      </div>

      <div className={styles.infoCard}>
       <div className={styles.infoIconWrap}>
        <svg
         width="28"
         height="28"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-accent)"
         strokeWidth="1.5"
        >
         <circle cx="12" cy="12" r="10" />
         <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
         <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
       </div>
       <h3 className={styles.infoTitle}>¿Por qué IA?</h3>
       <p className={styles.infoText}>
        Los modelos de deep learning pueden analizar miles de patrones en
        radiografías que el ojo humano podría pasar por alto, proporcionando un
        segundo criterio diagnóstico rápido y confiable.
       </p>
      </div>

      <div className={styles.infoCard}>
       <div className={styles.infoIconWrap}>
        <svg
         width="28"
         height="28"
         viewBox="0 0 24 24"
         fill="none"
         stroke="var(--color-accent)"
         strokeWidth="1.5"
        >
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
       </div>
       <h3 className={styles.infoTitle}>Objetivo del negocio</h3>
       <p className={styles.infoText}>
        Reducir el tiempo de diagnóstico de neumonía y mejorar la precisión
        mediante herramientas de apoyo basadas en inteligencia artificial,
        contribuyendo a mejores outcomes clínicos.
       </p>
      </div>
     </div>
    </div>
   </section>
  </div>
 );
}
