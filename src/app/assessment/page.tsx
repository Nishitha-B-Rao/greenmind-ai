"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const steps = [
  {
    id: "transport",
    question: "What is your primary transportation method?",
    options: ["Car", "Public Transport", "Bike", "Walk"],
  },
  {
    id: "diet",
    question: "How would you describe your diet?",
    options: ["Heavy Meat", "Mixed", "Vegetarian", "Vegan"],
  },
  {
    id: "shopping",
    question: "How often do you shop online?",
    options: ["Daily", "Weekly", "Monthly", "Rarely"],
  },
  {
    id: "household",
    question: "What is your household size?",
    options: ["1", "2-3", "4-5", "6+"],
  },
  {
    id: "electricity",
    question: "How would you rate your household electricity usage?",
    options: ["Low", "Medium", "High"],
  },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user, setOnboardingCompleted } = useAuth();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let token = "";
      if (user) {
        token = await user.getIdToken();
      }

      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(answers),
      });

      if (res.ok) {
        setOnboardingCompleted(true);
        router.push("/dashboard");
      } else {
        console.error("Failed to submit assessment");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const currentQuestion = steps[currentStep];
  const isNextDisabled = !answers[currentQuestion.id];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-xl shadow-xl border-none bg-white/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl text-green-900 font-bold">Your Climate Profile</CardTitle>
          <CardDescription className="text-base">Let&apos;s personalize your coaching experience</CardDescription>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4 h-2" />
        </CardHeader>
        <CardContent className="min-h-[220px]">
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-green-700 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 animate-spin drop-shadow-md" />
              <p className="font-medium animate-pulse">Analyzing your profile with GreenMind AI...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500" key={currentStep}>
              <h3 className="text-xl font-semibold text-slate-800 leading-snug">{currentQuestion.question}</h3>
              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <div 
                      key={option} 
                      className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? "border-green-500 bg-green-50 shadow-md transform scale-[1.01]" 
                          : "bg-white hover:border-green-300 hover:bg-slate-50 hover:shadow-sm"
                      }`}
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option })}
                    >
                      <RadioGroupItem value={option} id={option} className={isSelected ? "text-green-600 border-green-600" : ""} />
                      <Label htmlFor={option} className={`flex-1 cursor-pointer font-medium text-base ${isSelected ? "text-green-900" : "text-slate-700"}`}>
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
          {!isSubmitting && (
            <>
              <Button
                variant="outline"
                className="hover:bg-slate-100"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                onClick={handleNext} 
                disabled={isNextDisabled}
              >
                {currentStep === steps.length - 1 ? "Complete Profile" : "Continue"}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
