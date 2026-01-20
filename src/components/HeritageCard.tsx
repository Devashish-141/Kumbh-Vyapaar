import { motion } from "framer-motion";
import { Star, MapPin, Clock, ArrowRight } from "lucide-react";

interface HeritageCardProps {
  image: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  description: string;
  index: number;
  onDirectionClick?: () => void;
}

export function HeritageCard({
  image,
  title,
  location,
  duration,
  rating,
  description,
  index,
  onDirectionClick,
}: HeritageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elevated transition-all h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-xs font-semibold">{rating}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
          {description}
        </p>

        <button
          onClick={onDirectionClick}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-auto group/btn"
        >
          Explore More
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
