import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import BackButton from '../../../AuthSecure/BackButton';

const NavBlog = () => {
    return (
        <nav className='d-flex justify-content-around flex-wrap gap-2 mx-auto m-3 text-center' aria-label="Secondary Navigation">
            <Link to={"/Article"} >
                <Button variant='success' className="btn text-white fw-bold" aria-label="Publier un article">Publier / Article</Button>
            </Link>
            <BackButton />
            <Link to={"/Blog"} >
                <Button variant='success' className="btn text-white fw-bold" aria-label="Voir Les Articles du Blog">Articles du Blog</Button>
            </Link>
            <Link to={"/ReadArticles"}>
                <Button variant="success" className="btn text-white fw-bold" aria-label="Voir mes articles">Mes Articles</Button>
            </Link>
        </nav>
    );
};

export default NavBlog;
