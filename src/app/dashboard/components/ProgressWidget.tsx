"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function ProgressWidget({ completedCount }: { completedCount: number }) {
  return (
    <Card className="bg-gradient-to-br from-white/90 to-emerald-50/90 backdrop-blur-md border-white/50 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-green-600" />
          Completed Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-green-900">{completedCount}</div>
        <p className="text-xs text-green-600 mt-1">Sustainability goals achieved</p>
      </CardContent>
    </Card>
  );
}
