import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import DeleteArticleModal from './DeleteArticle.jsx';
import AddCommentModal from './AddComment.jsx';
import DeleteCommentModal from './DeleteCommentModal.jsx';
import { Pagination } from 'react-bootstrap';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import BackButton from '../../AuthSecure/BackButton.jsx';
import NavBlog from '../Router/Blog/NavBlog.jsx';
gsap.registerPlugin(ScrollTrigger);

const ReadArticles = () => {
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState([1]);
    const [articlesPerPage, setArticlesPerPage] = useState(10);
    const [loveArticles, setLoveArticles] = useState({});
    const [componentIsVisible, setComponentIsVisible] = useState(false);

        useEffect(() => {
            fetchArticles();
        }, [currentPage, articlesPerPage ]);

        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/article`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        setComponentIsVisible(true);
                    } else {
                        throw new Error('Une erreur est survenue lors du FETCH');
                    }
                } else {
                    const data = await response.json();
                    setArticles(data.articles);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        // const numberLove = articles;

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

                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/love`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ articleId, loveCount: newLoveCount }) // Utilisez articleId ici
                });
                
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

    gsap.utils.toArray('.slide-article').forEach((article, index) => {
      gsap.from(article, {
        scrollTrigger: {
          trigger: article,
          toggleActions: 'restart pause resume pause',
          start: 'top 80%', // Démarrer l'animation lorsque l'élément est à 80% de la hauteur de la fenêtre
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
    if ( componentIsVisible) {
        return(
            <>
            <section className='row col-md-11 mx-auto' style={{ marginTop: "40px", marginBottom: "350px" }}>
                <h1 className='h2 mx-auto graylogo text-center text-white fw-bold border border-5 border-secondary rounded col-md-10 mb-4'>Vous n'avez pas d'articles pour le moment.</h1>
                    <NavBlog/>
            </section>
            </>
    )}
    return (
        <>
        <section className='row col-md-11 mx-auto mt-5' >
            <NavBlog/>
            <h2 className='h2 mx-auto graylogo text-center text-white fw-bold border border-5 border-secondary rounded col-md-10 mb-4'>Mes sujets préférés.</h2>

            {articles.length > 0 ? (
                currentArticles.map((article, index) => (
                    <article key={index} className="col-md-10 mx-auto bg-black mb-5 p-1 text-white card">
                        <header className='mx-auto'>
                            <div className="row mx-auto">
                                <div className=" p-3 border mx-auto">
                                    <h3 className="h3 border-bottom text-center p-1">{article.titre}</h3>
                                            <p className='p-1'>
                                                <img 
                                                src={article.image_couverture}
                                                className="img-fluid row mx-auto p-2 img-art-hover"
                                                alt="Image illustrant l'article"
                                                aria-label="Image illustrant l'article" 
                                                style={{ float: 'right', clear: 'both', width: '50%' }}
                                                />
                                                {article.contenu}
                                            </p>
                                </div>
                                <div className="d-flex justify-content-around p-2">
                                    <p className='p-1'>Catégorie : {article.category.nom}</p>
                                    <p className='p-1'>Auteur : {article.auteur}</p>
                                    <Button
                                        className="heart-button"
                                        aria-label="J'aime"
                                        variant="outline-secondary"
                                        onClick={() => handleLoveClick(article.article_id, article.love)}
                                    >
                                        {article.love}
                                        <span role="img" aria-label="Cœur">💚</span> {loveArticles[article.article_id]}
                                    </Button>
                                </div>
                            </div>
                        </header>
                            <hr />
                            <section aria-label="Commentaires">
                                {article.comments && article.comments.length > 0 ? (
                                    <aside className="border border-4 mb-3">
                                        <h3 className='h3 p-1'>Commentaires :</h3>
                                        {article.comments.map((comment, idx) => (
                                            <aside key={idx} className="comment">
                                                <p className='p-1'><strong>Titre :</strong> {comment.titre}</p>
                                                <p className='p-1'><strong>Auteur :</strong> {comment.auteur}</p>
                                                <p className='p-1'><strong>Date :</strong> {comment.date_commentaire}</p>
                                                <p className='p-1'><strong>Contenu :</strong> {comment.contenu}</p>
                                                <DeleteCommentModal commentId={comment.commentId} articleId={article.article_id} fetchArticles={fetchArticles}/>
                                                <p className="border-bottom border-gray"></p>
                                            </aside>
                                        ))}
                                    </aside>
                                ) : (
                                    <h4 className='p-3'>Soyez le Premier à laisser un Commentaire.</h4>
                                )}
                            </section>
                        <footer className="d-flex justify-content-around gap-2 mx-auto m-3 text-center">
                            <AddCommentModal articleId={article.article_id} />
                            <DeleteArticleModal articleId={article.article_id} fetchArticles={fetchArticles} />
                        </footer>
                    </article>
                ))
            ) : (
                <nav className="row no-articles mx-auto" style={{ marginTop: "140px" }}>
                    <h2 className='h3 graylogo text-center mx-auto text-white fw-bold col-md-4 border border-5 border-secondary rounded'>Vous n'avez pas d'articles !</h2>
                    <nav className="row no-articles mx-auto text-center" aria-label="Secondary Navigation">
                        <Link to={"/Article"} >
                            <Button className="btn graylogo text-white fw-bold">Publier votre premier Article</Button>
                        </Link>
                    </nav>
                </nav>
            )}
            <nav aria-label="Pagination" >
                <Pagination className="pagination justify-content-center">
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} disabled={currentPage === 1} />
                    {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage === Math.ceil(articles.length / articlesPerPage) ? currentPage : currentPage + 1)} disabled={currentPage === Math.ceil(articles.length / articlesPerPage)} />
                </Pagination>
            </nav>
            <NavBlog/>
        </section>
    </>
    );
    
};

export default ReadArticles;
