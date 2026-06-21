"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lightbulb } from "lucide-react";

export function InsightCard({ topSource, recommendations }: { topSource: string, recommendations: string[] }) {
  return (
    <Card className="glass-card hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-white/50 group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Biggest Contributor: {topSource}</p>
            <p className="text-sm mt-1 opacity-90">Based on your profile, {topSource.toLowerCase()} accounts for the largest portion of your emissions.</p>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <p className="font-medium text-gray-700">Personalized Recommendations:</p>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
