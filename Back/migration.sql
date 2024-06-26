-- Début de la transaction
BEGIN;

-- Désactivation des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 0;

-- Suppression des tables existantes
DROP TABLE IF EXISTS 
    `PORTFOLIO`, `ARTICLES_TAGS`, `CATEGORIESARTICLES`, `COMMANDE`, `FACTURE`, 
    `PRODUIT_COMMANDE`, `PRODUIT_DEVIS`, `ROLE`, `TAGS`, `MESSAGE`, 
    `UTILISATEURS`, `ARTICLES`, `DEVIS`, `COMMENTAIRES`, `IMAGE`, `PRODUIT`, 
    `CATEGORIESPRODUITS`, `USERARTICLELOVE`;

-- Création de la table PORTFOLIO
CREATE TABLE `PORTFOLIO` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NOT NULL,
    `taille` INT NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `description` VARCHAR(1024),
    `url` VARCHAR(255) NOT NULL,  -- Champ pour stocker le chemin de l'image
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table CATEGORIESARTICLES
CREATE TABLE `CATEGORIESARTICLES` (
    `categorie_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255),
    `description` VARCHAR(1024)
);

-- Création de la table CATEGORIESPRODUITS
CREATE TABLE `CATEGORIESPRODUITS` (
    `categoriesproduits_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255)
);

-- Création de la table ROLE
CREATE TABLE `ROLE` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255)
);

-- Création de la table UTILISATEURS
CREATE TABLE `UTILISATEURS` (
    `utilisateur_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255),
    `prenom` VARCHAR(255),
    `societe` VARCHAR(255),
    `telephone` VARCHAR(55),
    `numero_tva` VARCHAR(55),
    `siret` VARCHAR(55),  -- Ajouté une virgule manquante ici
    `pseudo` VARCHAR(255),
    `statut` VARCHAR(255),
    `email` VARCHAR(255),
    `mot_de_passe` VARCHAR(255),
    `rue` VARCHAR(255),
    `ville` VARCHAR(255),
    `code_postal` VARCHAR(255),
    `date_inscription` TIMESTAMP,
    `avatar` VARCHAR(255),
    `biographie` VARCHAR(1024),
    `role_id` INT NULL,
    FOREIGN KEY (`role_id`) REFERENCES `ROLE`(`role_id`)
);

-- Création de la table TAGS
CREATE TABLE `TAGS` (
    `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255)
);

-- Création de la table ARTICLES
CREATE TABLE `ARTICLES` (
    `article_id` INT AUTO_INCREMENT PRIMARY KEY,
    `titre` VARCHAR(255),
    `contenu` TEXT,
    `date_publication` TIMESTAMP,
    `auteur` VARCHAR(255),
    `statut_publication` TINYINT NOT NULL DEFAULT 0,
    `vues` INT,
    `image_couverture` VARCHAR(1024),
    `categorie_id` INT NOT NULL,
    `utilisateur_id` INT NOT NULL,
    `love` INT,
    FOREIGN KEY (`categorie_id`) REFERENCES `CATEGORIESARTICLES`(`categorie_id`),  -- Corrigé la référence ici
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
);

-- Création de la table FACTURE
CREATE TABLE `FACTURE` (
    `facture_id` INT AUTO_INCREMENT PRIMARY KEY,
    `numero_facture` VARCHAR(255) NOT NULL,
    `nom_client` VARCHAR(255),
    `date_facture` TIMESTAMP,
    `date_echeance` TIMESTAMP,
    `montant_total` DECIMAL(10,2),
    `detail_projet` VARCHAR(255),
    `mode_paiement` VARCHAR(255),
    `statut_facture` TINYINT NOT NULL DEFAULT 0,
    `information_paiement` VARCHAR(255),
    `utilisateur_id` INT NULL,
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
);

-- Création de la table DEVIS
CREATE TABLE `DEVIS` (
    `devis_id` INT AUTO_INCREMENT PRIMARY KEY,
    `numero_devis` VARCHAR(255),
    `nom_client` VARCHAR(255),
    `date_devis` TIMESTAMP,
    `validite_devis` VARCHAR(255),
    `detail_projet` VARCHAR(1024),
    `statut_devis` TINYINT NOT NULL DEFAULT 0,
    `utilisateur_id` INT NULL,
    `facture_id` INT NULL,
    `vendu` TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`),
    FOREIGN KEY (`facture_id`) REFERENCES `FACTURE`(`facture_id`)
);

-- Création de la table COMMANDE
CREATE TABLE `COMMANDE` (
    `commande_id` INT AUTO_INCREMENT PRIMARY KEY,
    `numero_commande` VARCHAR(255) NOT NULL,
    `date_commande` TIMESTAMP,
    `nom_client` VARCHAR(255),
    `validite_commande` VARCHAR(255),
    `detail_projet` VARCHAR(1024),
    `statut_commande` TINYINT NOT NULL DEFAULT 0,
    `utilisateur_id` INT NULL,
    `facture_id` INT NULL,
    `vendu` TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`),
    FOREIGN KEY (`facture_id`) REFERENCES `FACTURE`(`facture_id`)
);

-- Création de la table PRODUIT
CREATE TABLE `PRODUIT` (
    `produit_id` INT AUTO_INCREMENT PRIMARY KEY,
    `nom` VARCHAR(255) NULL,
    `quantite` INT NOT NULL,
    `detail` TEXT NOT NULL,
    `tarif` DECIMAL(10,2) NOT NULL,  -- Correction du type de colonne pour tarif
    `statut` INT,
    `categoriesproduits_id` INT,
    FOREIGN KEY (`categoriesproduits_id`) REFERENCES `CATEGORIESPRODUITS`(`categoriesproduits_id`)
);

-- Création de la table PRODUIT_DEVIS
CREATE TABLE `PRODUIT_DEVIS` (
    `produit_devis_id` INT AUTO_INCREMENT PRIMARY KEY,
    `produit_id` INT NOT NULL,
    `devis_id` INT NOT NULL,
    `quantite` INT,
    FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
    FOREIGN KEY (`devis_id`) REFERENCES `DEVIS`(`devis_id`)
);

-- Création de la table PRODUIT_COMMANDE
CREATE TABLE `PRODUIT_COMMANDE` (
    `produit_commande_id` INT AUTO_INCREMENT PRIMARY KEY,
    `produit_id` INT NOT NULL,
    `commande_id` INT NOT NULL,
    `quantite` INT,
    FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
    FOREIGN KEY (`commande_id`) REFERENCES `COMMANDE`(`commande_id`)
);
-- Création de la table PRODUIT_COMMANDE
CREATE TABLE `PRODUIT_FACTURE` (
    `produit_facture_id` INT AUTO_INCREMENT PRIMARY KEY,
    `produit_id` INT NOT NULL,
    `facture_id` INT NOT NULL,
    `quantite` INT,
    FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
    FOREIGN KEY (`facture_id`) REFERENCES `FACTURE`(`facture_id`)
);

-- Création de la table IMAGE
CREATE TABLE `IMAGE` (
    `image_id` INT AUTO_INCREMENT PRIMARY KEY,
    `photo` VARCHAR(255) NOT NULL,
    `produit_id` INT,
    FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`)
);

-- Création de la table ARTICLES_TAGS
CREATE TABLE `ARTICLES_TAGS` (
    `article_tag_id` INT AUTO_INCREMENT PRIMARY KEY,
    `article_id` INT NOT NULL,
    `tag_id` INT NOT NULL,
    FOREIGN KEY (`article_id`) REFERENCES `ARTICLES`(`article_id`),
    FOREIGN KEY (`tag_id`) REFERENCES `TAGS`(`tag_id`)
);

-- Création de la table COMMENTAIRES
CREATE TABLE `COMMENTAIRES` (
    `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `titre` VARCHAR(255),
    `contenu` TEXT,
    `date_commentaire` TIMESTAMP,
    `auteur` VARCHAR(255),
    `statut_commentaire` TINYINT NOT NULL DEFAULT 0,
    `article_id` INT NOT NULL,
    FOREIGN KEY (`article_id`) REFERENCES `ARTICLES`(`article_id`)
);

-- Création de la table USERARTICLELOVE
CREATE TABLE `USERARTICLELOVE` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `utilisateur_id` INT NOT NULL,
    `article_id` INT NOT NULL,
    `date_love` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`) ON DELETE CASCADE,
    FOREIGN KEY (`article_id`) REFERENCES `ARTICLES`(`article_id`) ON DELETE CASCADE
);

-- Création de la table MESSAGE
CREATE TABLE `MESSAGE` (
    `message_id` INT AUTO_INCREMENT PRIMARY KEY,
    `pseudo` VARCHAR(255),
    `email` VARCHAR(255),
    `sujet` TEXT,
    `message` TEXT,
    `utilisateur_id` INT,
    FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
);

-- -- Génération de numéros aléatoires pour les factures
-- DELIMITER $$

-- CREATE TRIGGER before_insert_facture
-- BEFORE INSERT ON `FACTURE`
-- FOR EACH ROW
-- BEGIN
--     SET NEW.date_facture = CURRENT_TIMESTAMP();
--     SET NEW.date_echeance = DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 3 MONTH);
--     SET NEW.numero_facture = CONCAT('FACT-', MD5(RAND()), '-', UNIX_TIMESTAMP());
-- END$$

-- DELIMITER ;

-- -- Génération de numéros aléatoires pour les devis
-- DELIMITER $$

-- CREATE TRIGGER before_insert_devis
-- BEFORE INSERT ON `DEVIS`
-- FOR EACH ROW
-- BEGIN
--     SET NEW.numero_devis = CONCAT('DEV-', MD5(RAND()), '-', UNIX_TIMESTAMP());
-- END$$

-- DELIMITER ;

-- -- Génération de numéros aléatoires pour les commandes
-- DELIMITER $$

-- CREATE TRIGGER before_insert_commande
-- BEFORE INSERT ON `COMMANDE`
-- FOR EACH ROW
-- BEGIN
--     SET NEW.numero_commande = CONCAT('COM-', MD5(RAND()), '-', UNIX_TIMESTAMP());
-- END$$

-- DELIMITER ;

-- Réactivation des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- Validation de la transaction
COMMIT;
