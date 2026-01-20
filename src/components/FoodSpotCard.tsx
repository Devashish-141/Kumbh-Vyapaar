import { motion } from "framer-motion";
import { MapPin, Utensils, Navigation } from "lucide-react";

interface FoodSpotCardProps {
  name: string;
  specialty: string;
  location: string;
  timing: string;
  priceRange: string;
  image: string;
  index: number;
}

export function FoodSpotCard({
  name,
  specialty,
  location,
  timing,
  priceRange,
  image,
  index,
}: FoodSpotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
      className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-soft hover:shadow-elevated transition-all group"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full whitespace-nowrap">
            {priceRange}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Utensils className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm text-primary font-medium">{specialty}</span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{timing}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
