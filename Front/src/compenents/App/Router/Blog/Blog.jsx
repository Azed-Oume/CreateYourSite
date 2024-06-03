import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import DeleteArticleModal from '../../Article/DeleteArticle.jsx';
import AddCommentModal from '../../Article/AddComment.jsx';
import { Pagination } from 'react-bootstrap';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import DeleteCommentModal from '../../Article/DeleteCommentModal.jsx';
import BackButton from '../../../AuthSecure/BackButton.jsx';
gsap.registerPlugin(ScrollTrigger);

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState([1]);
  const [articlesPerPage, setArticlesPerPage] = useState(10);
  const [loveArticles, setLoveArticles] = useState({});

  
  useEffect(() => {
    fetchArticles(); // Ajoutez cet appel ici
  }, [currentPage, articlesPerPage ]);

  const fetchArticles = async () => { // pérmet de récuperer tout les articles du blog !
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/get/all/articles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                alert("Vous n'avez pas d'articles pour le moment.");
            } else {
                throw new Error('Une erreur est survenue lors du FETCH');
            }
        } else {
            const data = await response.json();
            console.log(data, "en ligne 41");
            setArticles(data.articles);
            console.log(data, "en ligne 43");
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
};

    const numberLove = articles;
    console.log(numberLove, "en ligne 51");

    const handleLoveClick = async (articleId, love) => {
        try { 
            const token = localStorage.getItem('token');
            let newLoveCount;
            
            if (loveArticles[articleId]) {
                // Si l'article est déjà aimé, on soustrait 1 pour désaimer
                newLoveCount = love - 1;
            } else {
                // Sinon, on ajoute 1 pour aimer l'article
                newLoveCount = love + 1;
            }
            
            console.log(love, " en ligne 54 xxxxxxxxxxxxxxxx");
            const response = await fetch(`http://localhost:3000/api/update/love`, { // pérmet la mise a jour des loves !
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ articleId, loveCount: newLoveCount }) // Utilisez articleId ici
            });
            
            console.log(newLoveCount, "en ligne 61");
            
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la mise à jour du nombre de loves');
            }
            
            // Mise à jour locale du nombre de "loves"
            fetchArticles();
            setLoveArticles(prevLove => ({
                ...prevLove,
                [articleId]: !prevLove[articleId]
            }));
        } catch (error) {
            console.error('Erreur lors de la mise à jour du nombre de loves:', error);
            // Gérer l'erreur ici, par exemple afficher un message à l'utilisateur ou effectuer une action appropriée
        }
    };
    
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
  /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

  useEffect(() => {
    // gsap.utils.toArray('.contact').forEach((article, index) => {
    //   gsap.from(article, {
    //     scrollTrigger: {
    //       trigger: article,
    //       toggleActions: 'restart pause resume pause',
    //       start: 'top 95%', // Démarrer l'animation lorsque l'élément est à 80% de la hauteur de la fenêtre
          
    //     },
    //     opacity: '0',
    //     x: 0,
    //     rotation: -3600,
    //     duration: 2,
    //     delay: 1 * index, // Décalage d'animation
    //     onComplete: () => {
    //       article.style.opacity = 1; // Rendre l'élément visible une fois l'animation terminée
    //     }
    //   });
    // });

    gsap.utils.toArray('.slide-article').forEach((article, index) => {
      gsap.from(article, {
        scrollTrigger: {
          trigger: article,
          toggleActions: 'restart pause resume pause',
          start: 'top 80% && 4', // Démarrer l'animation lorsque l'élément est à 80% de la hauteur de la fenêtre
        },
        opacity: 0, // Cacher initialement l'élément
        x: index % 2 === 0 ? -400 : 400, // Glissement vers la gauche pour les éléments pairs et vers la droite pour les impairs
        duration: 1,
        delay: 1 * index, // Laps de temps entre chaque élément
        onComplete: () => {
          article.style.opacity = 1; // Rendre l'élément visible une fois l'animation terminée
        }
      });
    });
  }, []);
  /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
  /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/


  return (
    // <section className='row col-md-11 mx-auto mt-4' >
    //         <Navbar className='d-flex justify-content-around gap-2 mx-auto m-4 text-center'>
    //           <Link to={"/Article"} >
    //               <Button
    //               variant='success' 
    //               className="btn graylogo text-white fw-bold" >Publier Un Article</Button>
    //           </Link>
    //           <BackButton />
    //           <Link to={"/ReadArticles"} >
    //               <Button
    //               variant='success' 
    //               className="btn graylogo text-white fw-bold">Voir Mes Articles </Button>
    //           </Link>
    //         </Navbar>
    //           <h2 className='h2 mx-auto graylogo text-center text-white fw-bold  border border-5 border-secondary rounded col-md-10 mb-4'>Les Articles du Blog</h2>
          
    //             {currentArticles.map((article, index) => (
    //             <section key={index} className="col-md-10 mx-auto article-container mb-5 p-1 text-white fw-bold border border-5 border-secondary rounded"
    //             >
    //                     <article className='slide-article mx-auto'>
    //                         <div className="row mx-auto">
    //                                 <div className='col-md-6 p-3 border mx-auto'>
    //                                     <h2 className='h4 border-bottom text-center p-1'>{article.titre}</h2>
    //                                     <p className='p-1'>{article.contenu}</p>
    //                                 </div>    
    //                                 <div className='col-md-6 p-3 border mx-auto'>
    //                                     {article.image_couverture ? (
    //                                         <img
    //                                             src={article.image_couverture}
    //                                             // alt="Ma Photo de Profil"
    //                                             style={{ width: '30rem', height: '30rem', objectFit: 'cover'}}
    //                                             className="img-fluid  border border-secondary border-5 row mx-auto m-3 rounded rounded-5"
    //                                             aria-label="Image illustrant l'article"
    //                                             />
    //                                         ) : null }
    //                                 </div>
    //                                 <div className="d-flex justify-content-around p-2">
    //                                     <p className='p-1'>Catégorie : {article.category.nom}</p>
    //                                     <p className='p-1'>Vu(s) : {article.vues}</p>

    //                                     <Button 
    //                                         className="heart-button" 
    //                                         aria-label="J'aime" 
    //                                         variant="outline-secondary" 
    //                                         onClick={()=> handleLoveClick(article.article_id, article.love)}>{article.love}
    //                                             <span role="img" aria-label="Cœur">💚</span> {loveArticles[article.article_id] }
    //                                     </Button>
    //                                 </div>
    //                         </div>
    //                             <div className="border-bottom border-gray"></div>
    //                                     {article.comments && article.comments.length > 0 ? (
    //                                         <aside className='border border-4 mb-3'>
    //                                             <h3 className='h4 p-1'>Commentaires :</h3>
    //                                                 {article.comments.map((comment, idx) => (
    //                                                     <aside key={idx} className="comment">
                                                            
    //                                                         <p className='p-1'><strong>Titre :</strong>{comment.titre}</p>
    //                                                         <p className='p-1'><strong>Auteur :</strong> {comment.auteur}</p>
    //                                                         <p className='p-1'><strong>Date :</strong> {comment.date_commentaire}</p>
    //                                                         <p className='p-1'><strong>Contenu :</strong> {comment.contenu}</p>
    //                                                         <p className='p-1'><strong>commentId :</strong> {comment.commentId}</p>
    //                                                         <DeleteCommentModal commentId={comment.commentId} articleId={article.article_id}/>
    //                                                         <div className="border-bottom border-gray"></div>

    //                                                     </aside>
                                                        
    //                                                 ))}
    //                                         </aside>
    //                                     ) : (
    //                                         <h4 className='p-3'>Soyez le Premier a laisser un Commentaire.</h4>
    //                                     )}                      
                                
    //                     </article>
    //                         <div className="d-flex justify-content-around gap-2 mx-auto m-3  text-center">
    //                             <AddCommentModal articleId={article.article_id} />
                                
    //                             <DeleteArticleModal articleId={article.article_id} fetchArticles={fetchArticles} />
    //                         </div>
    //             </section>
    //             ))}
    //                         <Pagination className="pagination justify-content-center">
    //                             <Pagination.Prev onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} disabled={currentPage === 1} />
    //                             {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
    //                             <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
    //                                 {i + 1}
    //                             </Pagination.Item>
    //                             ))}
    //                             <Pagination.Next onClick={() => setCurrentPage(currentPage === Math.ceil(articles.length / articlesPerPage) ? currentPage : currentPage + 1)} disabled={currentPage === Math.ceil(articles.length / articlesPerPage)} />
    //                         </Pagination>

    //                     <Navbar className='d-flex justify-content-around mx-auto m-3 text-center'>
    //                         <Link to={"/Article"} >
    //                             <Button 
    //                             variant='success'
    //                             className="graylogo text-white fw-bold" >Publier Un Article</Button>
    //                         </Link>
    //                         <Link to={"/ReadArticles"} >
    //                             <Button
    //                             variant='success' 
    //                             className="graylogo text-white fw-bold">Voir Mes Articles </Button>
    //                         </Link>
    //                     </Navbar>
    //       </section>

        <>
            <section className="row col-md-11 mx-auto mt-4">
                <nav className="d-flex justify-content-around gap-2 mx-auto m-4 text-center" aria-label="Main Navigation">
                    <Link to={"/Article"}>
                        <Button variant="success" className="btn graylogo text-white fw-bold" aria-label="Publier un article">Publier Un Article</Button>
                    </Link>
                    <BackButton />
                    <Link to={"/ReadArticles"}>
                        <Button variant="success" className="btn graylogo text-white fw-bold" aria-label="Voir mes articles">Voir Mes Articles</Button>
                    </Link>
                </nav>
                <h2 className="h2 mx-auto graylogo text-center text-white fw-bold border border-5 border-secondary rounded col-md-10 mb-4">Les Articles du Blog</h2>

                {currentArticles.map((article, index) => (
                <article key={index} className="col-md-10 mx-auto article-container mb-5 p-1 text-white fw-bold border border-5 border-secondary rounded">
                    <div className="slide-article mx-auto">
                        <div className="row mx-auto">
                            <div className="col-md-6 p-3 border mx-auto">
                                <h3 className="h4 border-bottom text-center p-1">{article.titre}</h3>
                                <p className="p-1">{article.contenu}</p>
                            </div>
                            <div className="col-md-6 p-3 border mx-auto">
                                {article.image_couverture && (
                                    <img
                                    src={article.image_couverture}
                                    alt={`Image illustrant l'article, ${article.titre}`}
                                    style={{ width: '30rem', height: '30rem', objectFit: 'cover' }}
                                    className="img-fluid border border-secondary border-5 row mx-auto m-3 rounded rounded-5"
                                    />
                                )}
                            </div>
                            <div className="d-flex justify-content-around p-2">
                                <p className="p-1">Catégorie : {article.category.nom}</p>
                                <p className="p-1">Vu(s) : {article.vues}</p>

                                <Button
                                    className="heart-button"
                                    aria-label="J'aime"
                                    variant="outline-secondary"
                                    onClick={() => handleLoveClick(article.article_id, article.love)}
                                >
                                    {article.love} <span role="img" aria-label="Cœur">💚</span> {loveArticles[article.article_id]}
                                </Button>
                            </div>
                        </div>
                        <hr />
                        {article.comments && article.comments.length > 0 ? (
                            <section className="border border-4 mb-3" aria-label="Commentaires">
                            <h3 className="h4 p-1">Commentaires :</h3>
                            {article.comments.map((comment, idx) => (
                                <article key={idx} className="comment">
                                <p className="p-1"><strong>Titre :</strong> {comment.titre}</p>
                                <p className="p-1"><strong>Auteur :</strong> {comment.auteur}</p>
                                <p className="p-1"><strong>Date :</strong> {comment.date_commentaire}</p>
                                <p className="p-1"><strong>Contenu :</strong> {comment.contenu}</p>
                                <DeleteCommentModal commentId={comment.commentId} articleId={article.article_id} />
                                <hr />
                                </article>
                            ))}
                            </section>
                        ) : (
                            <h4 className="p-3">Soyez le Premier à laisser un Commentaire.</h4>
                        )}
                    </div>
                    <div className="d-flex justify-content-around gap-2 mx-auto m-3 text-center">
                        <AddCommentModal articleId={article.article_id} />
                        <DeleteArticleModal articleId={article.article_id} fetchArticles={fetchArticles} />
                    </div>
                </article>
                ))}
                <nav aria-label="Pagination">
                    <Pagination className="pagination justify-content-center">
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} disabled={currentPage === 1} />
                        {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(currentPage === Math.ceil(articles.length / articlesPerPage) ? currentPage : currentPage + 1)} disabled={currentPage === Math.ceil(articles.length / articlesPerPage)} />
                    </Pagination>
                </nav>
                <nav className="d-flex justify-content-around mx-auto m-3 text-center" aria-label="Secondary Navigation">
                    <Link to={"/Article"}>
                        <Button variant="success" className="graylogo text-white fw-bold" aria-label="Publier un article">Publier Un Article</Button>
                    </Link>
                    <Link to={"/ReadArticles"}>
                        <Button variant="success" className="graylogo text-white fw-bold" aria-label="Voir mes articles">Voir Mes Articles</Button>
                    </Link>
                </nav>
            </section>
            </>

        
  )
};
export default Blog;