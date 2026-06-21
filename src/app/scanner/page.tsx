"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Navigation } from "@/components/Navigation";
import { ChatWidget } from "@/components/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Leaf, AlertTriangle } from "lucide-react";

type ScanResult = {
  success?: boolean;
  analysis?: unknown;
  error?: string;
};

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type === "image/jpeg" || selected.type === "image/png")) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    } else {
      alert("Please select a JPG or PNG image.");
    }
  };

  const { user } = useAuth();
  
  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const imageBase64 = base64String.split(",")[1];
        
        let token = "";
        if (user) token = await user.getIdToken();

        const res = await fetch("/api/receipt", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ imageBase64, mimeType: file.type })
        });
        
        const data = (await res.json()) as ScanResult;
        if (data.success) {
          setResult(data.analysis);
        } else {
          console.error(data.error);
        }
        setIsScanning(false);
      };
    } catch (e) {
      console.error(e);
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex flex-col relative">
      <Navigation />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Receipt Scanner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card shadow-xl border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle>Upload Grocery Receipt</CardTitle>
              <CardDescription>JPG or PNG formats only.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {preview ? (
                <div className="w-full relative h-64 border rounded-xl overflow-hidden bg-white/50 flex items-center justify-center shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Receipt preview" className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-300" />
                </div>
              ) : (
                <div 
                  className="w-full h-64 border-2 border-dashed border-emerald-300/50 rounded-xl flex flex-col items-center justify-center bg-white/40 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => document.getElementById("receipt")?.click()}
                >
                  <Upload className="w-10 h-10 text-emerald-400 mb-2 group-hover:text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-medium text-emerald-800/70">Click to upload or drag and drop</p>
                </div>
              )}
              
              <input 
                type="file" 
                id="receipt" 
                className="hidden" 
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl border-slate-200 hover:bg-slate-100"
                  onClick={() => document.getElementById("receipt")?.click()}
                  disabled={isScanning}
                >
                  {preview ? "Change File" : "Select File"}
                </Button>
                {preview && (
                  <Button 
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl"
                    onClick={handleScan}
                    disabled={isScanning}
                  >
                    {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Scan Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="glass-card shadow-xl border-white/50 bg-white/90 animate-in fade-in slide-in-from-right-8 duration-500">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Estimated Impact</p>
                  <p className={`text-lg font-bold ${result.estimatedFoodImpact === 'High' ? 'text-red-600' : 'text-green-600'}`}>
                    {result.estimatedFoodImpact}
                  </p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <p className="text-sm text-red-800 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Highest Offender
                  </p>
                  <p className="text-red-900 font-semibold">{result.highestOffender}</p>
                  <p className="text-xs text-red-700 mt-1">{result.reason}</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800 font-medium flex items-center gap-1">
                    <Leaf className="w-4 h-4" /> Eco Alternative
                  </p>
                  <p className="text-green-900 font-semibold">{result.ecoAlternative}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
