    -- Début de la transaction
     BEGIN;

     -- Désactivation des contraintes de clé étrangère
     SET FOREIGN_KEY_CHECKS = 0;

    
     -- Suppression des tables existantes
          DROP TABLE IF EXISTS `PORTFOLIO, ARTICLES_TAGS`, `CATEGORIES`, `COMMANDE`, `FACTURE`, `PRODUIT_COMMANDE`, `PRODUIT_DEVIS`, `ROLE`, `TAGS`, `MESSAGE`, `UTILISATEURS`, `ARTICLES`, `DEVIS`, `COMMENTAIRES`, `IMAGE`, `PRODUIT`, `CATEGORIESPRODUITS`;


  CREATE TABLE `PORTFOLIO` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `size` INT NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `location` VARCHAR(255) NOT NULL,  -- Champ pour stocker le chemin de l'image
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


     CREATE TABLE `CATEGORIES` (
       `category_id` INT AUTO_INCREMENT PRIMARY KEY,
       `nom` VARCHAR(255),
       `description` VARCHAR(1024)
     );

     CREATE TABLE `categoriesproduits` (
      `categoriesproduits_id` INT AUTO_INCREMENT PRIMARY KEY,
      `nom` VARCHAR(255)
);

     CREATE TABLE `UTILISATEURS` (
       `utilisateur_id` INT AUTO_INCREMENT PRIMARY KEY,
       `nom` VARCHAR(255),
       `prenom` VARCHAR(255),
       `societe` VARCHAR(255),
       `telephone` VARCHAR(55),
       `numero_tva` VARCHAR(55),
       `siret` VARCHAR(55)
       `pseudo` VARCHAR(255),
       `adresse_email` VARCHAR(255),
       `mot_de_passe` VARCHAR(255),
       `rue` VARCHAR(255),
       `ville` VARCHAR(255),
       `code_postal` VARCHAR(255),
       `date_inscription` TIMESTAMP,
       `avatar` VARCHAR(255),
       `biographie` VARCHAR(255),
       `role_id` INT NULL ,
       FOREIGN KEY (`role_id`) REFERENCES `ROLE`(`role_id`)
     );

     CREATE TABLE `ROLE` (
       `role_id` INT AUTO_INCREMENT PRIMARY KEY,
       `nom` VARCHAR(255)
     );

     CREATE TABLE `TAGS` (
       `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
       `nom` VARCHAR(255)
     );

     CREATE TABLE `ARTICLES` (
       `article_id` INT AUTO_INCREMENT PRIMARY KEY,
       `titre` VARCHAR(255),
       `contenu` TEXT,
       `date_publication` TIMESTAMP,
       `auteur` VARCHAR(255),
       `statut_publication` TINYINT NOT NULL DEFAULT 0,
       `vues` INT,
       `image_couverture` VARCHAR(1024),
       `category_id` INT NOT NULL,
       `utilisateur_id` INT NOT NULL,
       FOREIGN KEY (`category_id`) REFERENCES `CATEGORIES`(`category_id`),
       FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
     );

     CREATE TABLE `DEVIS` (
       `devis_id` INT AUTO_INCREMENT PRIMARY KEY,
       `numero_devis` VARCHaR(255),
       `nom_client` VARCHAR(255),
       `date_devis` TIMESTAMP,
       `validite_devis` VARCHAR(255),
       `detail_projet` VARCHAR(1024),
       `statut_devis` TINYINT NOT NULL DEFAULT 0,
       `utilisateur_id` INT NULL,
       `facture_id` INT NULL,
       FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`),
       FOREIGN KEY (`facture_id`) REFERENCES `FACTURE`(`facture_id`)
     );

     CREATE TABLE `FACTURE` (
       `facture_id` INT AUTO_INCREMENT PRIMARY KEY,
       `numero_facture` VARCHAR(255) NOT NULL,
       `nom_client` VARCHAR(255),
       `date_facture` TIMESTAMP,
       `date_echeance` TIMESTAMP,
       `montant_total` DECIMAL,
       `detail_projet` VARCHAR(255),
       `mode_paiement` VARCHAR(255),
       `statut_facture` TINYINT NOT NULL DEFAULT 0,
       `information_paiement` VARCHAR(255),
       `utilisateur_id` INT NULL,
       FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
     );

     CREATE TABLE `COMMANDE` (
       `commande_id` INT AUTO_INCREMENT PRIMARY KEY,
       `numero_commande` VARCHAR(255) NOT NULL,
       `date_commande` TIMESTAMP,
       `statu_commande` TINYINT NOT NULL DEFAULT 0,
       `utilisateur_id` INT NULL,
       `facture_id` INT NULL,
       FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`),
       FOREIGN KEY (`facture_id`) REFERENCES `FACTURE`(`facture_id`)
     );

     CREATE TABLE `produit` (
       `produit_id` INT AUTO_INCREMENT PRIMARY KEY,
       `nom` VARCHAR(255) NULL,
       `quantite` INT NOT NULL,
       `detail` TEXT NOT NULL,
       `tarif` INT NOT NULL,
       `categoriesproduits_id` INT,
       FOREIGN KEY (`categoriesproduits_id`) REFERENCES `categoriesproduits`(`categoriesproduits_id`) 
     );

     CREATE TABLE `PRODUIT_DEVIS` (
       `produit_devis_id` INT AUTO_INCREMENT PRIMARY KEY,
       `produit_id` INT NOT NULL,
       `devis_id` INT NOT NULL,
       FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
       FOREIGN KEY (`devis_id`) REFERENCES `DEVIS`(`devis_id`)
     );

     CREATE TABLE `PRODUIT_COMMANDE` (
       `produit_commande_id` INT AUTO_INCREMENT PRIMARY KEY,
       `produit_id` INT NOT NULL,
       `commande_id` INT NOT NULL,
       FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
       FOREIGN KEY (`commande_id`) REFERENCES `COMMANDE`(`commande_id`)
     );
     CREATE TABLE `IMAGE` (
       `image_id` INT AUTO_INCREMENT PRIMARY KEY,
       `photo` VARCHAR(255) NOT NULL,
       FOREIGN KEY (`produit_id`) REFERENCES `PRODUIT`(`produit_id`),
     );

     CREATE TABLE `ARTICLES_TAGS` (
       `article_tag_id` INT AUTO_INCREMENT PRIMARY KEY,
       `article_id` INT NOT NULL,
       `tag_id` INT NOT NULL,
       FOREIGN KEY (`article_id`) REFERENCES `ARTICLES`(`article_id`),
       FOREIGN KEY (`tag_id`) REFERENCES `TAGS`(`tag_id`)
     );

     CREATE TABLE `COMMENTAIRES` (
       `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
       `TITRE` VARCHAR(255),
       `contenu` TEXT,
       `date_commentaire` TIMESTAMP,
       `auteur` VARCHAR(255),
       `statut_commentaire` TINYINT NOT NULL DEFAULT 0,
       `article_id` INT NOT NULL,
       FOREIGN KEY (`article_id`) REFERENCES `ARTICLES`(`article_id`)
     );

     CREATE TABLE `MESSAGE` (
         `message_id` INT AUTO_INCREMENT PRIMARY KEY,
         `pseudo` VARCHAR(255),
         `adresse_email` VARCHAR(255),
         `sujet` TEXT ,
         `message` TEXT,
         `utilisateur_id` INT,
         FOREIGN KEY (`utilisateur_id`) REFERENCES `UTILISATEURS`(`utilisateur_id`)
     );

     -- Génération de numéros aléatoires pour les factures
     DELIMITER $$

    CREATE TRIGGER before_insert_facture
    BEFORE INSERT ON FACTURE
    FOR EACH ROW
    BEGIN
        SET NEW.date_facture = CURRENT_TIMESTAMP();
        SET NEW.date_echeance = DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 3 MONTH);
        SET NEW.numero_facture = CONCAT('FACT-', MD5(RAND()), '-', UNIX_TIMESTAMP());
    END$$

    DELIMITER ;

    
     -- Génération de numéros aléatoires pour les devis
     CREATE TRIGGER before_insert_devis
     BEFORE INSERT ON DEVIS
     FOR EACH ROW
     SET NEW.numero_devis = CONCAT('DEV-', MD5(RAND()), '-', UNIX_TIMESTAMP());

    
     -- Génération de numéros aléatoires pour les commandes
     CREATE TRIGGER before_insert_commande
     BEFORE INSERT ON COMMANDE
     FOR EACH ROW
     SET NEW.numero_commande = CONCAT('COM-', MD5(RAND()), '-', UNIX_TIMESTAMP());
    
    
    
     SET FOREIGN_KEY_CHECKS = 1;

    
     -- Validation de la transaction
     COMMIT;
