import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon, Leaf } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: LucideIcon;
  bgColorClass: string;
  imageUrl?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  count,
  description,
  icon: Icon,
  bgColorClass,
  imageUrl
}) => {
  return (
    <Link
      to={`/donations?category=${id}`}
      className="group p-7 rounded-3xl bg-white border border-sage-200/90 shadow-card hover:shadow-elevated transition-all duration-300 hover:border-forest-400 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden"
    >
      <div>
        {imageUrl ? (
          <div className="relative aspect-[16/10] -mx-7 -mt-7 mb-5 rounded-t-3xl overflow-hidden bg-sage-100">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bgColorClass} backdrop-blur-md shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white bg-forest-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                {count} Ready for Pickup
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${bgColorClass} shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-forest-800 bg-sage-100/90 px-3 py-1 rounded-full border border-sage-200">
              {count} Ready
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-2 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-sage-100 flex items-center justify-between text-xs font-bold text-forest-800">
        <span className="flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-forest-600 opacity-80" />
          <span>Explore {name}</span>
        </span>
        <ChevronRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default CategoryCard;
