-- Generated by Mocodo 4.2.4

CREATE TABLE ARTICLES (
  PRIMARY KEY (article_code),
  article_code       PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  titre              VARCHAR(255),
  contenu            TEXT NOT NULL,(65535),
  date_publication   TIMESTAMP NOT NULL,
  auteur             VARCHAR(255),
  statut_publication TINYINT,
  vues               INTEGER,
  image_couverture   VARCHAR(1024),
  categorie_code     INTEGER NOT NULL,
  utilisateur_code   INTEGER NOT NULL,
  love               INTEGER
);

CREATE TABLE ARTICLES_TAGS (
  PRIMARY KEY (article_code, tag_code),
  article_tag_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  article_code INTEGER NOT NULL,
  tag_code     INTEGER NOT NULL
);

CREATE TABLE CATEGORIES (
  PRIMARY KEY (categorie_code),
  categorie_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom            VARCHAR(255),
  "description"    VARCHAR(1024)
);

CREATE TABLE CATEGORIESPRODUITS (
  PRIMARY KEY (categoriesproduits_code),
  categoriesproduits_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom                     VARCHAR(255)
);

CREATE TABLE COMMANDE (
  PRIMARY KEY (commande_code),
  commande_code    PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  numero_commande  INTEGER,
  date_commande    TIMESTAMP,
  statu_commande   VARCHAR(255),
  utilisateur_code INTEGER NOT NULL,
  facture_code     VARCHAR(255) NOT NULL,
);

CREATE TABLE COMMENTAIRES (
  PRIMARY KEY (comment_code),
  comment_code       PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  titre              VARCHAR(255),
  contenu            TEXT(65535),
  date_commentaire   TIMESTAMP,
  auteur             VARCHAR(255),
  statut_commentaire TINYINT
  article_code       INTEGER NOT NULL,
);

CREATE TABLE DEVIS (
  PRIMARY KEY (devis_code),
  devis_code      PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  numero_devis     VARCHAR(255),
  nom_client       VARCHAR(255),
  date_devis       TIMESTAMP,
  validite_devis   VARCHAR(255),
  detail_projet    VARCHAR(1024),
  statut_devis     TINYINT,
  utilisateur_code INTEGER NOT NULL,
  facture_code     INTEGER NOT NULL,
);

CREATE TABLE FACTURE (
  PRIMARY KEY (facture_code),
  facture_code         PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  numero_facture       VARCHAR(255),
  nom_client           VARCHAR(255),
  date_facture         TIMESTAMP,
  date_echeance        TIMESTAMP,
  montant_total        DECIMAL(10,2),
  detail_projet        VARCHAR(255),
  mode_paiement        VARCHAR(255),
  statut_facture       TINYINT,
  information_paiement VARCHAR(255),
  utilisateur_code     INTEGER NOT NULL,
);

CREATE TABLE FACTURE_PRODUIT (
  PRIMARY KEY (facture_code, produit_code),
  facture_produit_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  facture_code INTEGER NOT NULL,
  produit_code INTEGER NOT NULL
);

CREATE TABLE IMAGE (
  PRIMARY KEY (image_code),
  image_code   PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  photo        VARCHAR(255),
  produit_code INTEGER NOT NULL,
);

CREATE TABLE MESSAGE (
  PRIMARY KEY (message_code),
  message_code     PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  pseudo           VARCHAR(255),
  adresse_email    VARCHAR(255),
  sujet            TEXT(65535),
  message          TEXT(65535),
  utilisateur_code INTEGER NOT NULL,
);

CREATE TABLE PRODUIT (
  PRIMARY KEY (produit_code),
  produit_code              PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom                       VARCHAR(255),
  quantite                  INTEGER,
  detail                    TEXT(65535),
  tarif                     DECIMAL(10,2),
  statut                    INTEGER
  categoriesproduits_code   INTEGER NOT NULL,
);

CREATE TABLE PRODUIT_COMMANDE (
  PRIMARY KEY (commande_code, produit_code),
  produit_commande_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  commande_code INTEGER NOT NULL,
  produit_code  INTEGER NOT NULL
);

CREATE TABLE PRODUIT_DEVIS (
  PRIMARY KEY (produit_code, devis_code),
  produit_devis_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  produit_code INTEGER NOT NULL,
  devis_code   INTEGER NOT NULL
);

CREATE TABLE ROLE (
  PRIMARY KEY (role_code),
  role_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom       VARCHAR(255)
);

CREATE TABLE TAGS (
  PRIMARY KEY (tag_code),
  tag_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom      VARCHAR(255)
);

CREATE TABLE UTILISATEURS (
  PRIMARY KEY (utilisateur_code),
  utilisateur_code PRIMARY KEY INTEGER AUTO_INCREMENT NOT NULL,
  nom              VARCHAR(255),
  prenom           VARCHAR(255),
  societe          VARCHAR(255),
  pseudo           VARCHAR(255),
  statut           VARCHAR(255),
  email            VARCHAR(255),
  mot_de_passe     VARCHAR(255),
  rue              VARCHAR(255),
  ville            VARCHAR(255),
  code_postal      INTEGER,
  date_inscription TIMESTAMP,
  avatar           VARCHAR(255),
  biographie       VARCHAR(255),
  role_code        INTEGER NOT NULL,
);

ALTER TABLE ARTICLES ADD FOREIGN KEY (utilisateur_code) REFERENCES UTILISATEURS (utilisateur_code);
ALTER TABLE ARTICLES ADD FOREIGN KEY (categorie_code) REFERENCES CATEGORIES (categorie_code);
ALTER TABLE ARTICLES_TAGS ADD FOREIGN KEY (tag_code) REFERENCES TAGS (tag_code);
ALTER TABLE ARTICLES_TAGS ADD FOREIGN KEY (article_code) REFERENCES ARTICLES (article_code);

ALTER TABLE COMMANDE ADD FOREIGN KEY (facture_code) REFERENCES FACTURE (facture_code);
ALTER TABLE COMMANDE ADD FOREIGN KEY (utilisateur_code) REFERENCES UTILISATEURS (utilisateur_code);

ALTER TABLE COMMENTAIRES ADD FOREIGN KEY (article_code) REFERENCES ARTICLES (article_code);

ALTER TABLE DEVIS ADD FOREIGN KEY (facture_code) REFERENCES FACTURE (facture_code);
ALTER TABLE DEVIS ADD FOREIGN KEY (utilisateur_code) REFERENCES UTILISATEURS (utilisateur_code);

ALTER TABLE FACTURE ADD FOREIGN KEY (utilisateur_code) REFERENCES UTILISATEURS (utilisateur_code);
ALTER TABLE FACTURE_PRODUIT ADD FOREIGN KEY (produit_code) REFERENCES PRODUIT (produit_code);
ALTER TABLE FACTURE_PRODUIT ADD FOREIGN KEY (facture_code) REFERENCES FACTURE (facture_code);

ALTER TABLE IMAGE ADD FOREIGN KEY (produit_code) REFERENCES PRODUIT (produit_code);

ALTER TABLE MESSAGE ADD FOREIGN KEY (utilisateur_code) REFERENCES UTILISATEURS (utilisateur_code);

ALTER TABLE PRODUIT ADD FOREIGN KEY (categoriesproduits_code_2) REFERENCES CATEGORIESPRODUITS (categoriesproduits_code);
ALTER TABLE PRODUIT_COMMANDE ADD FOREIGN KEY (produit_code) REFERENCES PRODUIT (produit_code);
ALTER TABLE PRODUIT_COMMANDE ADD FOREIGN KEY (commande_code) REFERENCES COMMANDE (commande_code);

ALTER TABLE PRODUIT_DEVIS ADD FOREIGN KEY (devis_code) REFERENCES DEVIS (devis_code);
ALTER TABLE PRODUIT_DEVIS ADD FOREIGN KEY (produit_code) REFERENCES PRODUIT (produit_code);

ALTER TABLE UTILISATEURS ADD FOREIGN KEY (role_code) REFERENCES ROLE (role_code);
