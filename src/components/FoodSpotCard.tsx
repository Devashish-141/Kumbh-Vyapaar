import { motion } from "framer-motion";
import { MapPin, Utensils, Navigation, Clock, Star } from "lucide-react";

interface FoodSpotCardProps {
  name: string;
  specialty: string;
  location: string;
  timing: string;
  priceRange: string;
  image: string;
  index: number;
  description?: string;
  onDirectionClick?: () => void;
}

export function FoodSpotCard({
  name,
  specialty,
  location,
  timing,
  priceRange,
  image,
  index,
  description,
  onDirectionClick,
}: FoodSpotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col sm:flex-row gap-5 p-5 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-soft hover:shadow-elevated hover:border-primary/20 transition-all duration-300"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Image Container */}
      <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
        <div className="absolute bottom-2 left-2 sm:hidden px-2 py-0.5 rounded-full bg-primary/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
          {priceRange}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="space-y-0.5">
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-primary/80">
              <Utensils className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold tracking-wide uppercase">{specialty}</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full whitespace-nowrap uppercase tracking-tighter">
              {priceRange}
            </span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">
            "{description}"
          </p>
        )}

        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <MapPin className="w-3 h-3 text-secondary" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <Clock className="w-3 h-3 text-secondary" />
              <span>{timing}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDirectionClick}
            className="flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 hover:bg-secondary hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
