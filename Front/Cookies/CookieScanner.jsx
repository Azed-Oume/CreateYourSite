import React, { useState, useEffect } from 'react';

const CookieScanner = () => {
  const [cookies, setCookies] = useState([]);

  useEffect(() => {
    const allCookies = document.cookie.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return { name, value };
    });
    setCookies(allCookies);
  }, []);

  return (
    <div className="container mt-5">
      <h1>Liste des Cookies</h1>
      <ul>
        {cookies.map((cookie, index) => (
          <li key={index}>
            <strong>{cookie.name}:</strong> {cookie.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CookieScanner;


// // import React, { useState, useEffect } from 'react';

// // const CookieScanner = () => {
// //   const [cookies, setCookies] = useState([]);

// //   useEffect(() => {
// //     // Extraire les cookies depuis document.cookie
// //     const cookiesString = document.cookie;
// //     const allCookies = cookiesString.split('; ').map(cookie => {
// //       const [name, value] = cookie.split('=');
// //       return { name, value };
// //     }).filter(cookie => cookie.name && cookie.value); // Filtrer les cookies valides
// //     setCookies(allCookies);
// //   }, []);

// //   return (
// //     <div className="container mt-5">
// //       <h1>Liste des Cookies</h1>
// //       <ul>
// //         {cookies.length > 0 ? (
// //           cookies.map((cookie, index) => (
// //             <li key={index}>
// //               <strong>{cookie.name}:</strong> {cookie.value}
// //             </li>
// //           ))
// //         ) : (
// //           <li>Aucun cookie détecté</li>
// //         )}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default CookieScanner;


// // import React, { useState, useEffect } from 'react';

// // const CookieScanner = () => {
// //   const [cookies, setCookies] = useState([]);

// //   useEffect(() => {
// //     const allCookies = document.cookie.split('; ').map(cookie => {
// //       const [name, value] = cookie.split('=');
// //       return { name, value };
// //     });

// //     // Pour débogage, afficher tous les cookies
// //     console.log('Cookies détectés:', allCookies);

// //     setCookies(allCookies);
// //   }, []);

// //   return (
// //     <div className="container mt-5">
// //       <h1>Liste des Cookies</h1>
// //       <ul>
// //         {cookies.length > 0 ? (
// //           cookies.map((cookie, index) => (
// //             <li key={index}>
// //               <strong>{cookie.name}:</strong> {cookie.value}
// //             </li>
// //           ))
// //         ) : (
// //           <li>Aucun cookie détecté</li>
// //         )}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default CookieScanner;
