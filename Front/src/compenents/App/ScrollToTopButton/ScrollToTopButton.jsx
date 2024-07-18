import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.scrollY > 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      // className={`position-fixed bottom-0 end-0  ${isVisible ? 'visible' : 'invisible'}`}
      // style={{ opacity: isVisible ? '1' : '0', transition: 'opacity 0.6s', zIndex: '10' }}
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '20px',
        zIndex: '101',
        opacity: isVisible ? '0.9' : '0',
        transition: 'opacity 0.6s',
        pointerEvents: isVisible ? 'auto' : 'none',  // Désactive les interactions quand invisible
    }}
    >
      <button
        className={`scroll-to-top-button ${isVisible ? ' animate__animated animate__bounce animate__delay-2s animate__repeat-11' : ''} rounded rounded-2`}
        onClick={scrollToTop}
        style={{
          boxShadow: '15px 15px 15px 15px rgba(3, 100, 24, .5)',
          background: 'rgba(3, 100, 24, 1)',
          color: 'black',
          transition: 'box-shadow 0.3s'
        }}
        onMouseOver={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, .9)'}
        onMouseOut={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, .2)'}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-up"
        >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
