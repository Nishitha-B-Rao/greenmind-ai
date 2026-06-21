"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "Hi! I'm GreenMind AI, your climate coach. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      let token = "";
      if (user) token = await user.getIdToken();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ message: input, history: messages })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newHistory, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 rounded-full h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 overflow-hidden px-4"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-white flex-shrink-0" />
          <span className="font-medium text-white overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap">
            Climate Coach
          </span>
        </div>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 shadow-2xl border-white/40 bg-white/85 backdrop-blur-xl z-50 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-500 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-4 flex flex-row items-center justify-between border-b border-white/10">
        <CardTitle className="text-md flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Climate Coach
        </CardTitle>
        <Button variant="ghost" size="icon" className="text-white hover:bg-green-700 w-8 h-8 rounded-full" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 rounded-lg p-3 text-sm flex gap-1">
                  <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t bg-white/50 backdrop-blur-md">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full gap-2">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your climate coach..." 
            className="flex-1 rounded-full border-slate-200 focus-visible:ring-emerald-500 bg-white"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
