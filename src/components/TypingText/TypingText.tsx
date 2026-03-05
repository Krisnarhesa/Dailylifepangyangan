'use client';

import { useAppContext } from '@/components/AppContext/AppContext';
import { useEffect, useRef, useState } from 'react';
import styles from './TypingText.module.css';

interface TypingTextProps {
  text: string;
  tagName?: any;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export default function TypingText({
  text,
  tagName: Tag = 'span',
  className = '',
  speed = 40,
  delay = 0,
  showCursor = false,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const { entered } = useAppContext(); // Get global entrance state

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only start typing if the component is in view AND the user has entered the web app
    if (!started || !entered) return;

    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, speed);
      }
    };

    const initialDelayId = setTimeout(() => {
      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialDelayId);
    };
  }, [started, entered, text, speed, delay]);

  return (
    // @ts-ignore
    <Tag ref={elementRef} className={`${styles.typingContainer} ${className}`}>
      {displayedText}
      {showCursor && started && <span className={styles.cursor}>|</span>}
    </Tag>
  );
}
