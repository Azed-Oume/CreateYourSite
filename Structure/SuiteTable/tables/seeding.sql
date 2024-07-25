BEGIN;
-- ATTENTION DONNÉES A INSÉRER OBLIGATOIREMENT DANS LA BDD "baracuda"! --
-- ATTENTION PENSÉE A GÉNÉRER AU MINIMUN UNE FAMILLE DE PRODUIT DANS LA TABLE "CATEGORIESPRODUITS" VIA L'INTÉRFACE FRONT ADMIN! --

TRUNCATE TABLE ROLE CASCADE;
TRUNCATE TABLE CATEGORIESARTICLES CASCADE;

INSERT INTO ROLE (nom) 
VALUES 
    ('Administrateur'), 
    ('Portfolio'), 
    ('E-commerce'), 
    ('Visiteur'), 
    ('Client');

INSERT INTO CATEGORIESARTICLES (nom, description) 
VALUES 
    ('Bio', 'Articles liés à la biologie'),
    ('Business', 'Articles liés au monde des affaires'),
    ('Cuisine', 'Articles liés à la cuisine'),
    ('Mode', 'Articles liés à la mode'),
    ('Politique', 'Articles liés à la politique'),
    ('Technologie', 'Articles liés à la technologie'),
    ('Voyages', 'Articles liés aux voyages');

COMMIT;
