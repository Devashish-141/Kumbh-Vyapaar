import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  variant: "visitor" | "merchant";
  onClick: () => void;
  getStartedText: string;
}

export function RoleCard({
  icon: Icon,
  title,
  subtitle,
  description,
  variant,
  onClick,
  getStartedText,
}: RoleCardProps) {
  const isVisitor = variant === "visitor";

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-8 text-left transition-all w-full group ${isVisitor
          ? "bg-card border-2 border-border hover:border-primary shadow-soft hover:shadow-glow-saffron"
          : "bg-secondary text-secondary-foreground border-2 border-secondary hover:border-teal-light shadow-soft hover:shadow-glow-teal"
        }`}
    >
      {/* Background decoration */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 transition-opacity group-hover:opacity-20 ${isVisitor ? "bg-primary" : "bg-teal-light"
          }`}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`inline-flex p-4 rounded-xl mb-6 ${isVisitor
            ? "gradient-saffron text-primary-foreground"
            : "gradient-teal text-secondary-foreground"
          }`}
      >
        <Icon className="w-8 h-8" />
      </motion.div>

      <p
        className={`text-sm font-medium mb-1 ${isVisitor ? "text-primary" : "text-teal-light"
          }`}
      >
        {subtitle}
      </p>
      <h3 className="text-2xl font-display font-semibold mb-3">{title}</h3>
      <p
        className={`text-sm leading-relaxed ${isVisitor ? "text-muted-foreground" : "text-secondary-foreground/80"
          }`}
      >
        {description}
      </p>

      <motion.div
        className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${isVisitor ? "text-primary" : "text-teal-light"
          }`}
      >
        <span>{getStartedText}</span>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
