
import { useState, useEffect, RefObject } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
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

  // This is just a placeholder function to maintain compatibility with existing code
  const setupOutsideClickHandler = (contentRef: RefObject<HTMLElement>) => {
    // The actual click handling is now done in the useEffect above
    // This function exists just to maintain the API for existing code
  };

  return {
    isOpen,
    toggle,
    close,
    setupOutsideClickHandler,
    collapsed,
    toggleCollapse
  };
}
