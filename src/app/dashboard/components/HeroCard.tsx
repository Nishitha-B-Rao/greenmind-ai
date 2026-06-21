"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { calculateCarbonScore, calculateImprovementPercentage } from "@/utils/scoring";

export function HeroCard({ baseScore, completedCount, riskLevel }: { baseScore: number, completedCount: number, riskLevel: string }) {
  const currentScore = calculateCarbonScore(baseScore, completedCount);
  const improvement = calculateImprovementPercentage(baseScore, currentScore);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Your Carbon Score</CardTitle>
          <div className="flex gap-2">
            {improvement > 0 && (
              <Badge variant="secondary" className="bg-green-400 text-green-950 border-none font-bold">
                ↓ {improvement}%
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">
              {riskLevel} Risk
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="white"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{currentScore}</span>
            <span className="text-sm opacity-80">/ 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
