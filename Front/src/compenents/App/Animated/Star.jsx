import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import basketball from "../../images/basketball.png";
import { Button } from 'react-bootstrap';

const Star = () => {
    const ballonRef = useRef(null);
    const [suivreSouris, setSuivreSouris] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const toggleSuivreSouris = () => {
        setSuivreSouris(!suivreSouris); // Inverser l'état du suivi de la souris
    };

    useEffect(() => {
        const suivre = (event) => {
            if (suivreSouris && event.target !== ballonRef.current) {
                const x = event.clientX;
                const y = event.clientY;
                gsap.to(ballonRef.current, {
                    x: x,
                    y: y,
                    duration: 0.2,
                    ease: 'power1.out',
                });
            }
        };
        if (ballonRef.current) {
        window.addEventListener('mousemove', suivre);
        };
        return () => {
            window.removeEventListener('mousemove', suivre);
        };
    }, [suivreSouris]);

    return (
      <div>
      <img
          ref={ballonRef}
          src={basketball}
          alt="Ballon de basket"
          style={{
              position: 'fixed',
              width: '50px',
              height: 'auto',
              userSelect: 'none',
              zIndex: '100',
          }}
      />
      <div style={{ position: 'fixed', top: '120px', left: '10px',  zIndex: "101" }}>
          <Button
          className='text-white fw-bold scroll'
          variant='success'
          // className='text-white fw-bold scroll'
          style={{
            boxShadow: '5px 5px 5px 5px rgba(3, 100, 24, 0.5)',
            background: 'rgba(3, 100, 24, 01)',
            color: 'black',
            transition: 'box-shadow 0.3s'
            // opacity: isVisible ? '0.9' : '0',
            // transition: 'opacity 0.6s',
        }}
        onMouseOver={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, 0.9)'}
        onMouseOut={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, 0.2)'}
            onClick={toggleSuivreSouris}  >
              {suivreSouris ? 'Lacher le Ballon' : 'Reprendre le Ballon'}
          </Button>
      </div>
  </div>
    );
};

export default Star;
