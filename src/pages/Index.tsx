import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { SymptomInput } from "@/components/SymptomInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePDF } from "@/utils/pdfGenerator";

interface AnalysisResult {
  summary: string;
  probable_causes: string[];
  red_flags: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high";
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [currentSymptoms, setCurrentSymptoms] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async (symptoms: string) => {
    setIsLoading(true);
    setCurrentSymptoms(symptoms);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms },
      });

      if (error) throw error;

      if (data) {
        setResults(data);
        toast({
          title: "Analysis Complete",
          description: "Your symptoms have been analyzed successfully.",
        });
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (results) {
      generatePDF(results, currentSymptoms);
      toast({
        title: "PDF Downloaded",
        description: "Your health report has been saved.",
      });
    }
  };

  const handleNewAnalysis = () => {
    setResults(null);
    setCurrentSymptoms("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-6"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-soft)]">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              MedGuide
            </h1>
          </div>
          <p className="text-center text-muted-foreground mt-2 text-lg">
            Your AI-Powered Health Companion
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-16">
        {!results ? (
          <>
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12 max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powered by Google Gemini AI
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get Instant Health Insights
              </h2>
              <p className="text-lg text-muted-foreground">
                Describe your symptoms and receive AI-powered guidance to help you understand
                your health better. Our advanced analysis provides clear, actionable insights.
              </p>
            </motion.div>

            {/* Symptom Input */}
            <SymptomInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                {
                  title: "AI-Powered Analysis",
                  description: "Advanced AI analyzes your symptoms in seconds",
                },
                {
                  title: "Clear Guidance",
                  description: "Easy-to-understand recommendations and insights",
                },
                {
                  title: "PDF Reports",
                  description: "Download detailed reports to share with your doctor",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <>
            <ResultsDisplay results={results} onDownloadPDF={handleDownloadPDF} />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center mt-8"
            >
              <button
                onClick={handleNewAnalysis}
                className="text-primary hover:text-primary-glow font-medium underline underline-offset-4 transition-colors"
              >
                Analyze New Symptoms
              </button>
            </motion.div>
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-6 text-center text-sm text-muted-foreground"
      >
        <p>Made with ❤️ for better health awareness</p>
      </motion.footer>
    </div>
  );
};

export default Index;