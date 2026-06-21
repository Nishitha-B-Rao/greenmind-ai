"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Loader2, CheckCircle2 } from "lucide-react";

type Challenge = {
  _id: string;
  title: string;
  description: string;
  status?: string;
};

export function ChallengeCard({ activeChallenge }: { activeChallenge: Challenge | null }) {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(activeChallenge);
  const [loading, setLoading] = useState(false);

  const generateChallenge = async () => {
    setLoading(true);
    try {
      let token = "";
      if (user) token = await user.getIdToken();
      const res = await fetch("/api/challenges/generate", { 
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.challenge) setChallenge(data.challenge);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async () => {
    if (!challenge) return;
    setLoading(true);
    try {
      let token = "";
      if (user) token = await user.getIdToken();
      const res = await fetch(`/api/challenges/${challenge._id}/complete`, { 
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.challenge) setChallenge(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-white/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Target className="w-5 h-5 text-blue-500" />
          Weekly AI Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        {challenge ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">You don&apos;t have an active challenge. Let AI generate a personalized sustainability challenge for you!</p>
        )}
      </CardContent>
      <CardFooter>
        {challenge ? (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={completeChallenge}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Mark as Completed
          </Button>
        ) : (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white" 
            onClick={generateChallenge}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Generate Challenge
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
