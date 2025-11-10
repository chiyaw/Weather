import React, { useEffect, useRef } from 'react'
import Weather from './components/Weather.jsx'

const App = () => {
  const appRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;

    // Track cursor position
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      
      // Update custom cursor position
      app.style.setProperty('--cursor-x', `${e.clientX}px`);
      app.style.setProperty('--cursor-y', `${e.clientY}px`);
      
      // Add cursor active class
      app.classList.add('cursor-active');
      
      // Update cursor element position using transform
      const cursor = app.querySelector('::before');
      if (app.style) {
        app.style.setProperty('--mouse-x', e.clientX + 'px');
        app.style.setProperty('--mouse-y', e.clientY + 'px');
      }
      
      // Create sparkle effect occasionally
      if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => {
      app.classList.add('cursor-active');
    };

    const handleMouseLeave = () => {
      app.classList.remove('cursor-active');
    };

    // Create sparkle particles
    const createSparkle = (x, y) => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      app.appendChild(sparkle);
      
      setTimeout(() => {
        sparkle.remove();
      }, 3000);
    };

    // Add event listeners
    app.addEventListener('mousemove', handleMouseMove);
    app.addEventListener('mouseenter', handleMouseEnter);
    app.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      app.removeEventListener('mousemove', handleMouseMove);
      app.removeEventListener('mouseenter', handleMouseEnter);
      app.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className='app' ref={appRef}>
      <div className='background-orb'></div>
      <div className='background-orb'></div>
      <div className='background-orb'></div>
      <div className='floating-bubble'></div>
      <div className='floating-bubble'></div>
      <div className='floating-bubble'></div>
      <div className='floating-bubble'></div>
      <div className='floating-bubble'></div>
      <Weather />
    </div>
  )
}

export default App
