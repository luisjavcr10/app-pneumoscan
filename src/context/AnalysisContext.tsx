"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface AnalysisResult {
 diagnosis: "Normal" | "Neumonía";
 confidence: number;
 details: string;
 recommendations: string[];
 analyzedAt: string;
}

interface AnalysisContextType {
 selectedFile: File | null;
 previewUrl: string | null;
 analysisResult: AnalysisResult | null;
 setSelectedFile: (file: File | null) => void;
 setPreviewUrl: (url: string | null) => void;
 startAnalysis: () => void;
 resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
 undefined,
);

const MOCK_RESULTS: AnalysisResult[] = [
 {
  diagnosis: "Neumonía",
  confidence: 94.7,
  details:
   "Se detectaron opacidades alveolares en el lóbulo inferior derecho, consistentes con un patrón de neumonía bacteriana. Se observa broncograma aéreo y consolidación parcial.",
  recommendations: [
   "Consultar con un especialista en neumología",
   "Considerar estudios complementarios (hemograma, proteína C reactiva)",
   "Iniciar tratamiento antibiótico empírico según protocolo",
   "Seguimiento con radiografía de control en 48-72 horas",
  ],
  analyzedAt: new Date().toISOString(),
 },
 {
  diagnosis: "Normal",
  confidence: 97.2,
  details:
   "No se detectaron anomalías significativas en la radiografía de tórax. Los campos pulmonares se visualizan claros, sin opacidades ni consolidaciones. Silueta cardíaca de tamaño normal.",
  recommendations: [
   "No se requiere tratamiento adicional",
   "Continuar con controles de rutina",
   "Consultar si presentan síntomas respiratorios persistentes",
  ],
  analyzedAt: new Date().toISOString(),
 },
];

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
  null,
 );

 const startAnalysis = useCallback(() => {
  // Mock: randomly pick one of the mock results
  const randomResult =
   MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  setAnalysisResult({
   ...randomResult,
   analyzedAt: new Date().toISOString(),
  });
 }, []);

 const resetAnalysis = useCallback(() => {
  setSelectedFile(null);
  if (previewUrl) {
   URL.revokeObjectURL(previewUrl);
  }
  setPreviewUrl(null);
  setAnalysisResult(null);
 }, [previewUrl]);

 return (
  <AnalysisContext.Provider
   value={{
    selectedFile,
    previewUrl,
    analysisResult,
    setSelectedFile,
    setPreviewUrl,
    startAnalysis,
    resetAnalysis,
   }}
  >
   {children}
  </AnalysisContext.Provider>
 );
}

export function useAnalysis() {
 const context = useContext(AnalysisContext);
 if (!context) {
  throw new Error("useAnalysis must be used within an AnalysisProvider");
 }
 return context;
}
