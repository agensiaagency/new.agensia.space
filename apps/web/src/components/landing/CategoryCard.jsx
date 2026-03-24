
import React, { memo, useCallback } from 'react';

const CategoryCard = memo(({ cat, onClick, style, className }) => {
  const handleClick = useCallback((e) => {
    if (onClick) onClick(e);
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className={`category-card group ${className || ''}`}
      style={style}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.03)] text-[#e8e4df] group-hover:scale-110 transition-all duration-300 group-hover:bg-transparent shrink-0"
             style={{ '--hover-color': cat.color }}>
          <cat.icon size={24} className="text-[#e8e4df] transition-colors duration-300 group-hover:text-[var(--hover-color)]" />
        </div>
        <div className="flex flex-col justify-center text-left">
          <h3 className="text-[16px] font-[600] font-serif text-[#e8e4df] mb-1 transition-colors leading-snug">
            {cat.title}
          </h3>
          <p className="text-[13px] text-[#e8e4df] opacity-50 leading-tight line-clamp-2">
            {cat.desc}
          </p>
        </div>
      </div>
    </button>
  );
});

CategoryCard.displayName = 'CategoryCard';
export default CategoryCard;
