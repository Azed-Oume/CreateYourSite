import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Pagination } from 'react-bootstrap';
import DeleteArticleModal from '../../Article/DeleteArticle.jsx';
import AddCommentModal from '../../Article/AddComment.jsx';
import DeleteCommentModal from '../../Article/DeleteCommentModal.jsx';
import BackButton from '../../../AuthSecure/BackButton.jsx';
import NavBlog from './NavBlog.jsx';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(10);
  const [loveArticles, setLoveArticles] = useState({});

  useEffect(() => {
    fetchArticles();
  }, [currentPage, articlesPerPage]);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/all/articles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert("Pas d'articles pour le moment.");
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

  const handleLoveClick = async (articleId, love) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Connectez-vous ou créez un compte pour ajouter un love !");
        return;
      }

      let newLoveCount = loveArticles[articleId] ? love - 1 : love + 1;

      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/love`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ articleId, loveCount: newLoveCount })
      });

      if (!response.ok) {
        throw new Error('Une erreur est survenue lors de la mise à jour du nombre de loves');
      }

      fetchArticles();
      setLoveArticles(prevLove => ({
        ...prevLove,
        [articleId]: !prevLove[articleId]
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du nombre de loves:', error);
    }
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
        <section className="row col-md-11 mx-auto mt-5">
          <NavBlog/>
          <h2 className="h2 mx-auto graylogo text-center text-white fw-bold border border-5 border-secondary rounded col-md-10 mb-4">Les Articles du Blog</h2>

          {currentArticles.map((article, index) => (
            <article key={index} className="col-md-10 mx-auto bg-black mb-5 p-1 text-white card">
              <header className="mx-auto">
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
                    <p className="p-1">Catégorie : {article.category.nom}</p>
                    <p className="p-1">Auteur : {article.auteur}</p>

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
              </header>
              <hr />
              <section aria-label="Commentaires">
                {article.comments && article.comments.length > 0 ? (
                  <aside className="border border-4 mb-3">
                    <h3 className="h3 p-1">Commentaires :</h3>
                    {article.comments.map((comment, idx) => (
                      <article key={idx} className="comment">
                        <p className="p-1"><strong>Titre :</strong> {comment.titre}</p>
                        <p className="p-1"><strong>Auteur :</strong> {comment.auteur}</p>
                        <p className="p-1"><strong>Date :</strong> {comment.date_commentaire}</p>
                        <p className="p-1"><strong>Contenu :</strong> {comment.contenu}</p>
                        <DeleteCommentModal commentId={comment.commentId} articleId={article.article_id} fetchArticles={fetchArticles}/>
                        <hr />
                      </article>
                    ))}
                  </aside>
                ) : (
                  <h4 className="p-3">Soyez le Premier à laisser un Commentaire.</h4>
                )}
              </section>
              <footer className="d-flex justify-content-around gap-2 mx-auto m-3 text-center">
                <AddCommentModal articleId={article.article_id} />
                <DeleteArticleModal articleId={article.article_id} fetchArticles={fetchArticles} />
              </footer>
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
          <NavBlog/>
        </section>
    </>
  );
};

export default Blog;
