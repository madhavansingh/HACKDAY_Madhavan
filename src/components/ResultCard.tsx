import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ResultCardProps {
  icon: LucideIcon;
  title: string;
  content: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  delay?: number;
}

const variantStyles = {
  default: "border-border bg-card",
  success: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-danger/30 bg-danger/5",
};

const iconVariantStyles = {
  default: "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
  success: "bg-gradient-to-br from-success to-secondary text-success-foreground",
  warning: "bg-gradient-to-br from-warning to-primary text-warning-foreground",
  danger: "bg-gradient-to-br from-danger to-warning text-danger-foreground",
};

export const ResultCard = ({
  icon: Icon,
  title,
  content,
  variant = "default",
  delay = 0,
}: ResultCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl border-2 p-6 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-medium)] ${variantStyles[variant]}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconVariantStyles[variant]} flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
          <div className="text-muted-foreground">{content}</div>
        </div>
      </div>
    </motion.div>
  );
};