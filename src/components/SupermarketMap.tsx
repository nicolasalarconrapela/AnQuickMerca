import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { usePanZoom } from '../hooks/usePanZoom';
import { SupermarketMapData, MapSection } from '../types';
import localMapData from '../data/supermarket-map.json';

interface SupermarketMapProps {
    data?: SupermarketMapData;
    onSectionSelect?: (section: MapSection) => void;
    selectedSectionId?: string;
    className?: string;
    showLegend?: boolean;
    showControls?: boolean;
}

const DynamicIcon = ({ name, size = 16, className, color }: { name: string; size?: number; className?: string; color?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <Icon size={size} className={className} color={color} />;
};

export const SupermarketMap: React.FC<SupermarketMapProps> = ({
    data = localMapData as SupermarketMapData,
    onSectionSelect,
    selectedSectionId,
    className = "",
    showLegend = true,
    showControls = true,
}) => {
    const { transform, containerRef, handleMouseDown, handleMouseMove, handleMouseUp } = usePanZoom({
        minScale: 0.3,
        maxScale: 3,
        initialScale: 0.6,
    });

    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats: Record<string, string> = {};
        data.sections.forEach(s => {
            cats[s.category] = s.color;
        });
        return Object.entries(cats);
    }, [data.sections]);

    return (
        <div className={`relative w-full h-full bg-white dark:bg-[#0f231b] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl ${className}`}>
            {/* Interaction Layer */}
            <svg
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                viewBox={`0 0 ${data.map.width} ${data.map.height}`}
                preserveAspectRatio="xMidYMid meet"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
                    {/* Background Grid */}
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-slate-900" />
                        </pattern>
                        <filter id="selection-glow">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect width={data.map.width} height={data.map.height} fill="url(#grid)" rx={20} />

                    {/* Sections */}
                    {data.sections.map((section) => {
                        const isSelected = selectedSectionId === section.id;
                        const isHovered = hoveredId === section.id;

                        // App theme interpretation
                        const themeColor = section.color;
                        const baseOpacity = isSelected ? 0.35 : (isHovered ? 0.25 : 0.12);

                        return (
                            <g
                                key={section.id}
                                className="transition-all duration-500 cursor-pointer"
                                onMouseEnter={() => setHoveredId(section.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => onSectionSelect?.(section)}
                            >
                                {/* Glow for selection */}
                                {isSelected && (
                                    <rect
                                        x={section.rect.x - 6}
                                        y={section.rect.y - 6}
                                        width={section.rect.w + 12}
                                        height={section.rect.h + 12}
                                        fill={themeColor}
                                        rx={24}
                                        className="opacity-20 animate-pulse"
                                        filter="url(#selection-glow)"
                                    />
                                )}

                                {/* Main Rect */}
                                <rect
                                    x={section.rect.x}
                                    y={section.rect.y}
                                    width={section.rect.w}
                                    height={section.rect.h}
                                    fill={isSelected ? themeColor : (isHovered ? themeColor : `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(themeColor.slice(3, 5), 16)}, ${parseInt(themeColor.slice(5, 7), 16)}, 0.15)`)}
                                    stroke={isSelected ? '#007043' : themeColor}
                                    strokeWidth={isSelected ? 4 : 2}
                                    rx={20}
                                    className="transition-all duration-300"
                                    style={{
                                        opacity: isSelected ? 1 : 0.9,
                                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                                        transformOrigin: `${section.rect.x + section.rect.w / 2}px ${section.rect.y + section.rect.h / 2}px`
                                    }}
                                />

                                {/* Content */}
                                <foreignObject
                                    x={section.rect.x}
                                    y={section.rect.y}
                                    width={section.rect.w}
                                    height={section.rect.h}
                                    className="pointer-events-none"
                                >
                                    <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2 overflow-hidden">
                                        <DynamicIcon
                                            name={section.icon}
                                            size={Math.min(section.rect.w, section.rect.h) / 3}
                                            color={isSelected ? 'white' : themeColor}
                                            className="transition-all duration-300 drop-shadow-sm"
                                        />
                                        <span
                                            className={`font-black uppercase tracking-tighter text-center leading-none truncate w-full transition-colors ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}
                                            style={{ fontSize: Math.max(9, Math.min(section.rect.w, section.rect.h) / 9) }}
                                        >
                                            {section.label}
                                        </span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Legend Overlay */}
            {showLegend && (
                <div className="absolute top-6 left-6 max-h-[70%] overflow-y-auto hide-scrollbar p-6 bg-white/95 dark:bg-[#0f231b]/95 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[2rem] shadow-2xl pointer-events-auto transition-all duration-500 ring-1 ring-black/5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-5 px-1 sticky top-0 bg-transparent">Categorías · Mercadona</h4>
                    <div className="flex flex-col gap-3.5">
                        {categories.map(([cat, color]) => (
                            <div key={cat} className="flex items-center gap-3.5 group">
                                <div className="w-4 h-4 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 flex-shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{cat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected indicator (if any) */}
            {selectedSectionId && (
                <div className="absolute top-6 right-6 px-4 py-3 bg-primary text-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-3">
                    <DynamicIcon name={data.sections.find(s => s.id === selectedSectionId)?.icon || 'MapPin'} size={18} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">Seleccionado</span>
                        <span className="text-sm font-bold leading-none">{data.sections.find(s => s.id === selectedSectionId)?.label}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
