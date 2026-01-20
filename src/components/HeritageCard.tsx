import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";

interface HeritageCardProps {
  image: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  description: string;
  index: number;
}

export function HeritageCard({
  image,
  title,
  location,
  duration,
  rating,
  description,
  index,
}: HeritageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-elevated transition-all"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-xs font-medium text-foreground">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>

        <motion.button
          whileHover={{ x: 4 }}
          className="mt-4 text-sm font-medium text-primary flex items-center gap-2"
        >
          Explore More
          <span>→</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
