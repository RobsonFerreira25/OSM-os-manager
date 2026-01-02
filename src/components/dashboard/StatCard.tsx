import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  delay?: number;
}

const variantStyles = {
  default: 'stat-card',
  primary: 'stat-card-gradient bg-gradient-to-br from-primary to-primary/80',
  success: 'stat-card-gradient bg-gradient-to-br from-success to-success/80',
  warning: 'stat-card-gradient bg-gradient-to-br from-warning to-warning/80',
  info: 'stat-card-gradient bg-gradient-to-br from-info to-info/80',
};

const iconContainerStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-success-foreground/20 text-success-foreground',
  warning: 'bg-warning-foreground/20 text-warning-foreground',
  info: 'bg-info-foreground/20 text-info-foreground',
};

const textStyles = {
  default: {
    title: 'text-muted-foreground',
    value: 'text-foreground',
    subtitle: 'text-muted-foreground',
  },
  primary: {
    title: 'text-primary-foreground/80',
    value: 'text-primary-foreground',
    subtitle: 'text-primary-foreground/70',
  },
  success: {
    title: 'text-success-foreground/80',
    value: 'text-success-foreground',
    subtitle: 'text-success-foreground/70',
  },
  warning: {
    title: 'text-warning-foreground/80',
    value: 'text-warning-foreground',
    subtitle: 'text-warning-foreground/70',
  },
  info: {
    title: 'text-info-foreground/80',
    value: 'text-info-foreground',
    subtitle: 'text-info-foreground/70',
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={variantStyles[variant]}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium', textStyles[variant].title)}>
            {title}
          </p>
          <p className={cn('text-3xl font-bold', textStyles[variant].value)}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-sm', textStyles[variant].subtitle)}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className={cn('text-xs', textStyles[variant].subtitle)}>
                vs mês anterior
              </span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', iconContainerStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
