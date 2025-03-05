
import { useState, useEffect } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  // Setup a global click handler to close the sidebar when clicking anywhere
  useEffect(() => {
    const handleGlobalClick = () => {
      if (isOpen) {
        close();
      }
    };
    
    // Add the event listener with a slight delay to prevent immediate closing
    // when the toggle button itself is clicked
    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener('click', handleGlobalClick);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleGlobalClick);
      };
    }
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close
  };
}
