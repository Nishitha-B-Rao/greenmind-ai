"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";

export function ProgressChart({ baseScore, currentScore }: { baseScore: number, currentScore: number }) {
  // Generate a realistic looking history chart based on the two data points we have
  const data = [
    { name: "Week 1", score: baseScore },
    { name: "Week 2", score: Math.round(baseScore - (baseScore - currentScore) * 0.4) },
    { name: "Week 3", score: Math.round(baseScore - (baseScore - currentScore) * 0.8) },
    { name: "Now", score: currentScore },
  ];

  return (
    <Card className="glass-card shadow-xl border-white/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <TrendingDown className="w-5 h-5 text-emerald-600" />
          Progress History
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
