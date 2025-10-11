import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface SymptomInputProps {
  onAnalyze: (symptoms: string) => void;
  isLoading: boolean;
}

export const SymptomInput = ({ onAnalyze, isLoading }: SymptomInputProps) => {
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = () => {
    if (symptoms.trim()) {
      onAnalyze(symptoms);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-[var(--shadow-medium)] p-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Describe Your Symptoms</h2>
            <p className="text-sm text-muted-foreground">
              Share what you're experiencing, and our AI will help guide you
            </p>
          </div>
        </div>
        
        <Textarea
          placeholder="Example: I've been experiencing a headache for two days, along with mild fever and fatigue..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[160px] resize-none text-base border-2 focus:border-primary transition-colors"
          disabled={isLoading}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!symptoms.trim() || isLoading}
          className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze Symptoms
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          This is not a substitute for professional medical advice. Always consult a healthcare provider.
        </p>
      </div>
    </motion.div>
  );
};