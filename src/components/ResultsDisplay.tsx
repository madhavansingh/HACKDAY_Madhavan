import { motion } from "framer-motion";
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react";
import { ResultCard } from "./ResultCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnalysisResult {
  summary: string;
  probable_causes: string[];
  red_flags: string[];
  recommended_actions: string[];
  risk_level: "low" | "medium" | "high";
}

interface ResultsDisplayProps {
  results: AnalysisResult;
  onDownloadPDF: () => void;
}

const riskLevelConfig = {
  low: {
    label: "Low Risk",
    variant: "success" as const,
    color: "bg-success text-success-foreground",
  },
  medium: {
    label: "Medium Risk",
    variant: "warning" as const,
    color: "bg-warning text-warning-foreground",
  },
  high: {
    label: "High Risk",
    variant: "danger" as const,
    color: "bg-danger text-danger-foreground",
  },
};

export const ResultsDisplay = ({ results, onDownloadPDF }: ResultsDisplayProps) => {
  const riskConfig = riskLevelConfig[results.risk_level] || riskLevelConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Risk Level Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <Badge className={`${riskConfig.color} px-6 py-2 text-base font-semibold`}>
          {riskConfig.label}
        </Badge>
      </motion.div>

      {/* Summary Card */}
      <ResultCard
        icon={FileText}
        title="Summary"
        content={<p className="text-base leading-relaxed">{results.summary}</p>}
        delay={0.1}
      />

      {/* Red Flags Card - Only show if there are red flags */}
      {results.red_flags && results.red_flags.length > 0 && (
        <ResultCard
          icon={AlertTriangle}
          title="⚠️ Important Warning Signs"
          variant="danger"
          content={
            <ul className="space-y-2">
              {results.red_flags.map((flag, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <span>{flag}</span>
                </motion.li>
              ))}
            </ul>
          }
          delay={0.2}
        />
      )}

      {/* Probable Causes Card */}
      <ResultCard
        icon={AlertCircle}
        title="Possible Causes"
        variant={riskConfig.variant}
        content={
          <ul className="space-y-2">
            {results.probable_causes.map((cause, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-lg">•</span>
                <span>{cause}</span>
              </motion.li>
            ))}
          </ul>
        }
        delay={0.3}
      />

      {/* Recommended Actions Card */}
      <ResultCard
        icon={CheckCircle}
        title="Recommended Actions"
        variant="success"
        content={
          <ul className="space-y-2">
            {results.recommended_actions.map((action, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>{action}</span>
              </motion.li>
            ))}
          </ul>
        }
        delay={0.4}
      />

      {/* Download PDF Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={onDownloadPDF}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-[var(--shadow-soft)] text-base font-semibold px-8"
        >
          <Download className="mr-2 h-5 w-5" />
          Download PDF Report
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-muted-foreground px-4"
      >
        <p>
          ⚕️ This analysis is for informational purposes only and is not a substitute for
          professional medical advice, diagnosis, or treatment. Always seek the advice of your
          physician or other qualified health provider.
        </p>
      </motion.div>
    </motion.div>
  );
};