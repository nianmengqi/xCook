import React from 'react';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function CardImage({ src, alt, className, onClick }: CardImageProps) {
  return (
    <div className={cn('relative aspect-video overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        onClick={onClick}
      />
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('px-4 py-3 bg-gray-50 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}
