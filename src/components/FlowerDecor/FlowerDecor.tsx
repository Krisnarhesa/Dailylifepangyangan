import React from 'react';
import styles from './FlowerDecor.module.css';

type FlowerSize = 'xs' | 'small' | 'medium' | 'large' | 'xlarge';
type FlowerBlur = 'none' | 'light' | 'medium' | 'heavy';

interface FlowerDecorProps {
  size?: FlowerSize;
  blur?: FlowerBlur;
  opacity?: number;
  rotation?: number;
  delay?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
}

const sizeMap: Record<FlowerSize, string> = {
  xs: styles.xs,
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
  xlarge: styles.xlarge,
};

const blurMap: Record<string, string> = {
  light: styles.blurLight,
  medium: styles.blurMedium,
  heavy: styles.blurHeavy,
};

export default function FlowerDecor({
  size = 'medium',
  blur = 'none',
  opacity = 0.2,
  rotation = 0,
  delay = 0,
  top,
  left,
  right,
  bottom,
  className = '',
}: FlowerDecorProps) {
  const classes = [
    styles.flower,
    sizeMap[size],
    blur !== 'none' ? blurMap[blur] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: React.CSSProperties = {
    opacity,
    transform: `rotate(${rotation}deg)`,
    animationDelay: `${delay}s`,
    ...(top !== undefined && { top }),
    ...(left !== undefined && { left }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
  };

  return (
    <div className={classes} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/bunga.svg" alt="" aria-hidden="true" />
    </div>
  );
}
