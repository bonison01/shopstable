
import { useState, useEffect, RefObject } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  const setupOutsideClickHandler = (contentRef: RefObject<HTMLElement>) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isOpen && contentRef.current && 
            contentRef.current.contains(event.target as Node)) {
          close();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, contentRef]);
  };

  return {
    isOpen,
    toggle,
    close,
    setupOutsideClickHandler
  };
}
