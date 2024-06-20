import React from "react";
import { useEffect, useRef, useState } from "react";
import '../../../../styles/monStyle.css'; // Assurez-vous que le chemin est correct

const GeneratedLogos = () => {
    const logos = [
        { name: 'JavaScript', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg' },
        { name: 'JSX', logoUrl: 'https://techdifferences.com/wp-content/uploads/2018/06/XML-vs-HTML.png' },
        { name: 'React', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
        { name: 'React-Bootstrap', logoUrl: 'https://repository-images.githubusercontent.com/256536328/0f6ae900-8c92-11ea-97db-b0d65a272b88' },
        { name: 'Bootstrap', logoUrl: 'https://lowendbox.com/wp-content/uploads/2024/03/bootstrap-logo-1024x1024.png' },
        { name: 'HTML', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg' },
        { name: 'CSS', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg' },
        { name: 'Sass', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg' },
        { name: 'SCSS', logoUrl: 'https://t3.ftcdn.net/jpg/04/29/01/68/360_F_429016835_wCoL2SJ8rnVHjK1qPQkZu9h1x6kIekkR.jpg' },
        { name: 'Node.js', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
        { name: 'MySQL', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg' },
        { name: 'PostgreSQL', logoUrl: 'https://e7.pngegg.com/pngimages/738/738/png-clipart-postgresql-database-logo-application-software-computer-software-mysql-logo-blue-text.png' },
    ];


    const containerRef = useRef(null);
    const observerRef = useRef(null);
    const [isLogosVisible, setIsLogosVisible] = useState(false);
    

    useEffect(() => {
        const options = {
            threshold: 0.8 // Déclencher lorsque 80% du conteneur est visible
        };
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsLogosVisible(true);
                    // Détecte si le conteneur des logos est visible
                    if (observerRef.current && observerRef.current.unobserve) {
                        observerRef.current.unobserve(entries[0].target);
                    }
                    // Lance l'animation lorsque le conteneur est visible
                    if (containerRef.current) {
                        containerRef.current.classList.add("animate-logos");
                    }
                }
            },
            options
        );

        if (containerRef.current) {
            observerRef.current.observe(containerRef.current);
        }

        return () => {
            if (observerRef.current && observerRef.current.disconnect) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <section ref={containerRef} className="d-flex justify-content-center text-white fw-bold gap-5 flex-wrap">
            {isLogosVisible && logos.map((logo, index) => (
                <figure key={logo.name} className="falling-logo" style={{ animationDelay: `${0.08 * index}s` }}>
                    <img src={logo.logoUrl} alt={logo.name} style={{ width: "100px" }} />
                    <figcaption>{logo.name}</figcaption>
                </figure>
            ))}
        </section>
    );
};

export default GeneratedLogos;