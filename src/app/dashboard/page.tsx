"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { HeroCard } from "./components/HeroCard";
import { InsightCard } from "./components/InsightCard";
import { ChallengeCard } from "./components/ChallengeCard";
import { ProgressWidget } from "./components/ProgressWidget";
import { ProgressChart } from "./components/ProgressChart";
import { Loader2 } from "lucide-react";
import { calculateCarbonScore } from "@/utils/scoring";

type Assessment = {
  carbonScore?: number;
  riskLevel?: string;
  topEmissionSource?: string;
  recommendations?: string[];
};

type Challenge = {
  _id: string;
  status?: string;
  title: string;
  description: string;
};

type DashboardData = {
  assessment?: Assessment;
  challenges?: Challenge[];
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const { assessment, challenges } = data;
  const completedChallenges = challenges?.filter((challenge) => challenge.status === "completed").length || 0;
  const activeChallenge = challenges?.find((challenge) => challenge.status === "accepted") || null;
  
  const currentScore = calculateCarbonScore(assessment?.carbonScore || 0, completedChallenges);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <HeroCard 
          baseScore={assessment?.carbonScore || 0} 
          completedCount={completedChallenges} 
          riskLevel={assessment?.riskLevel || "Unknown"} 
        />
        <ProgressChart baseScore={assessment?.carbonScore || 0} currentScore={currentScore} />
        <InsightCard 
          topSource={assessment?.topEmissionSource || "Unknown"} 
          recommendations={assessment?.recommendations || []} 
        />
      </div>
      <div className="space-y-6">
        <ProgressWidget completedCount={completedChallenges} />
        <ChallengeCard activeChallenge={activeChallenge} />
      </div>
    </div>
  );
}
