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
 isGenerating: boolean;
 setSelectedFile: (file: File | null) => void;
 setPreviewUrl: (url: string | null) => void;
 startAnalysis: () => Promise<void>;
 getAIRecommendations: () => Promise<void>;
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
 const [isGenerating, setIsGenerating] = useState(false);

 const startAnalysis = useCallback(async () => {
  if (!selectedFile) return;

  const apiUrl = process.env.NEXT_PUBLIC_ANALYSIS_API_URL;

  if (apiUrl) {
   try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(apiUrl, {
     method: "POST",
     body: formData,
    });

    if (!response.ok) throw new Error("API response error");

    const data = await response.json();
    const diagnosisMapped =
     data.prediction === "PNEUMONIA" ? "Neumonía" : "Normal";

    setAnalysisResult({
     diagnosis: diagnosisMapped,
     confidence: data.confidence * 100,
     details: "", // Start empty to trigger Gemini
     recommendations: [],
     analyzedAt: new Date().toISOString(),
    });
    return;
   } catch (error) {
    console.error("API Error, falling back to mock:", error);
   }
  }

  // Fallback: randomly pick one of the mock results BUT empty details for Gemini
  const randomResult =
   MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  setAnalysisResult({
   ...randomResult,
   details: "", // Explicitly empty to force Gemini generation
   recommendations: [],
   analyzedAt: new Date().toISOString(),
  });
 }, [selectedFile]);

 const getAIRecommendations = useCallback(async () => {
  if (!analysisResult) return;

  setIsGenerating(true);
  try {
   const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     diagnosis: analysisResult.diagnosis,
     confidence: analysisResult.confidence,
    }),
   });

   if (!response.ok) throw new Error("Failed to fetch recommendations");

   const data = await response.json();
   setAnalysisResult((prev) =>
    prev
     ? {
        ...prev,
        details: data.details,
        recommendations: data.recommendations,
       }
     : null,
   );
  } catch (error) {
   console.error("Gemini API Error, falling back to mock details:", error);
   const fallbackResult = MOCK_RESULTS.find(
    (r) => r.diagnosis === analysisResult.diagnosis,
   );
   if (fallbackResult) {
    setAnalysisResult((prev) =>
     prev
      ? {
         ...prev,
         details: fallbackResult.details,
         recommendations: fallbackResult.recommendations,
        }
      : null,
    );
   }
  } finally {
   setIsGenerating(false);
  }
 }, [analysisResult]);

 const resetAnalysis = useCallback(() => {
  setSelectedFile(null);
  if (previewUrl) {
   URL.revokeObjectURL(previewUrl);
  }
  setPreviewUrl(null);
  setAnalysisResult(null);
  setIsGenerating(false);
 }, [previewUrl]);

 return (
  <AnalysisContext.Provider
   value={{
    selectedFile,
    previewUrl,
    analysisResult,
    isGenerating,
    setSelectedFile,
    setPreviewUrl,
    startAnalysis,
    getAIRecommendations,
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
