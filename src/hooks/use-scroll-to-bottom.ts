'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollToBottom() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: handle scroll when the page is reloaded or rendered
  useEffect(() => {
    handleScroll();
  }, []);

  return {
    messagesEndRef,
    showScrollButton,
    setShowScrollButton,
    handleScroll,
  };
}
