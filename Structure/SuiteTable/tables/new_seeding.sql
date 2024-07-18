-- Insertion de données de test dans la table ROLE
-- Insertion de données de test dans la table ROLE
INSERT INTO ROLE (nom) VALUES ('Administrateur'), ('Utilisateur'), ('Abonné'), ('Auteur'), ('Client');

-- Insertion de données de test dans la table UTILISATEURS
INSERT INTO UTILISATEURS (nom, prenom, societe, pseudo, adresse_email, mot_de_passe, rue, code_postal, ville, date_inscription, avatar, biographie, role_id) 
VALUES 
('Dupont', 'Jean', 'ABC Inc.', 'jdupont', 'jdupont@example.com', 'motdepasse123', '123 Rue Principale', '12345', 'VilleA', CURRENT_TIMESTAMP(), 'avatar1.jpg', 'Biographie de Jean Dupont', 1),
('Martin', 'Marie', 'XYZ Ltd.', 'mmartin', 'mmartin@example.com', 'motdepasse456', '456 Avenue Secondaire', '54321', 'VilleB', CURRENT_TIMESTAMP(), 'avatar2.jpg', 'Biographie de Marie Martin', 2),
('Smith', 'John', 'Acme Corp.', 'jsmith', 'jsmith@example.com', 'password789', '789 Main Street', '67890', 'CityC', CURRENT_TIMESTAMP(), 'avatar3.jpg', 'Biography of John Smith', 3),
('Taylor', 'Alice', 'Tech Solutions', 'ataylor', 'ataylor@example.com', 'passwordabc', '321 Elm Street', '54321', 'CityD', CURRENT_TIMESTAMP(), 'avatar4.jpg', 'Biography of Alice Taylor', 4),
('Doe', 'Jane', 'Doe & Co.', 'jdoe', 'jdoe@example.com', 'passwordxyz', '987 High Street', '01234', 'CityE', CURRENT_TIMESTAMP(), 'avatar5.jpg', 'Biography of Jane Doe', 5);


-- Insertion de données de test dans la table CATEGORIES
INSERT INTO CATEGORIES (nom, description) VALUES ('Technologie', 'Articles liés à la technologie'), ('Mode', 'Articles liés à la mode');

-- Insertion de données de test dans la table TAGS
INSERT INTO TAGS (nom) VALUES ('Informatique'), ('Science'), ('Design'), ('Vêtements'), ('Accessoires');

-- Insertion de données de test dans la table ARTICLES
INSERT INTO ARTICLES (titre, contenu, date_publication, auteur, statut_publication, vues, image_couverture, category_id, utilisateur_id) 
VALUES 
('Nouvelle tendance en matière de smartphones', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', CURRENT_TIMESTAMP(), 'Jean Dupont', 1, 100, 'image1.jpg', 1, 1),
('Les dernières avancées en intelligence artificielle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', CURRENT_TIMESTAMP(), 'Marie Martin', 1, 150, 'image2.jpg', 1, 2),
('Le futur de l\'internet des objets', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', CURRENT_TIMESTAMP(), 'John Smith', 1, 200, 'image3.jpg', 2, 1),
('Introduction à la robotique domestique', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', CURRENT_TIMESTAMP(), 'Alice Taylor', 1, 120, 'image4.jpg', 2, 2),
('Les tendances de l\'intelligence artificielle en 2024', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', CURRENT_TIMESTAMP(), 'Jane Doe', 1, 180, 'image5.jpg', 1, 3);

-- Insertion de données de test dans la table DEVIS
INSERT INTO DEVIS (numero_devis, nom_client, date_devis, validite_devis, detail_projet, statut_devis, utilisateur_id, facture_id) 
VALUES 
('DEV-abc123', 'Client A', CURRENT_TIMESTAMP(), '30 jours', 'Projet de développement web', 0, 1, NULL),
('DEV-def456', 'Client B', CURRENT_TIMESTAMP(), '45 jours', 'Projet de conception graphique', 0, 2, NULL),
('DEV-ghi789', 'Client C', CURRENT_TIMESTAMP(), '60 jours', 'Projet de développement mobile', 0, 3, NULL),
('DEV-jkl012', 'Client D', CURRENT_TIMESTAMP(), '30 jours', 'Projet de conception UI/UX', 0, 4, NULL),
('DEV-mno345', 'Client E', CURRENT_TIMESTAMP(), '45 jours', 'Projet de développement logiciel', 0, 5, NULL);

-- Insertion de données de test dans la table FACTURE
INSERT INTO FACTURE (numero_facture, nom_client, date_facture, date_echeance, montant_total, detail_projet, mode_paiement, statut_facture, information_paiement, utilisateur_id) 
VALUES 
('FACT-xyz789', 'Client A', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 30 DAY), 1500.00, 'Facturation pour le projet de développement web', 'Carte de crédit', 0, 'Facture non payée', 1),
('FACT-ghi123', 'Client B', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 45 DAY), 2000.00, 'Facturation pour le projet de conception graphique', 'Virement bancaire', 0, 'Facture non payée', 2),
('FACT-jkl456', 'Client C', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 60 DAY), 2500.00, 'Facturation pour le projet de développement mobile', 'Chèque', 0, 'Facture non payée', 3),
('FACT-mno789', 'Client D', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 30 DAY), 1800.00, 'Facturation pour le projet de conception UI/UX', 'Virement bancaire', 0, 'Facture non payée', 4),
('FACT-pqr012', 'Client E', CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 45 DAY), 2200.00, 'Facturation pour le projet de développement logiciel', 'Carte de crédit', 0, 'Facture non payée', 5);

-- Insertion de données de test dans la table COMMANDE
INSERT INTO COMMANDE (numero_commande, date_commande, statu_commande, utilisateur_id, facture_id) 
VALUES 
('COM-123abc', CURRENT_TIMESTAMP(), 0, 1, 1),
('COM-456def', CURRENT_TIMESTAMP(), 0, 2, 1),
('COM-789ghi', CURRENT_TIMESTAMP(), 0, 3, 2),
('COM-jkl012', CURRENT_TIMESTAMP(), 0, 4, 3),
('COM-mno345', CURRENT_TIMESTAMP(), 0, 5, 3);

-- Insertion de données de test dans la table PRODUIT
INSERT INTO PRODUIT (nom, tarif, avatar) 
VALUES 
('taux_horaire', '35€/heure', 'mon-avatar.jpg'),
('taux_journalier', '200€/jour', 'son-avatar.jpg'),
('taux_hebdo', '900€/semaine', 'notre-avatar.jpg'),
('taux_mensuel', '3500€/mois', 'leurs-avatar.jpg');


-- Insertion de données de test dans la table PRODUIT_DEVIS
INSERT INTO PRODUIT_DEVIS (produit_id, devis_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4);

-- Insertion de données de test dans la table PRODUIT_COMMANDE
INSERT INTO PRODUIT_COMMANDE (produit_id, commande_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4);

-- Insertion de données de test dans la table ARTICLES_TAGS
INSERT INTO ARTICLES_TAGS (article_id, tag_id) VALUES (1, 1), (2, 2), (3, 3), (4, 1), (5, 2);

-- Insertion de données de test dans la table COMMENTAIRES
INSERT INTO COMMENTAIRES (contenu, date_commentaire, auteur, statut_commentaire, article_id) 
VALUES 
('Super article !', CURRENT_TIMESTAMP(), 'Commentateur1', 1, 1),
('Très intéressant.', CURRENT_TIMESTAMP(), 'Commentateur2', 1, 1),
('Merci pour le partage.', CURRENT_TIMESTAMP(), 'Commentateur3', 1, 2),
('J\'adore votre travail !', CURRENT_TIMESTAMP(), 'Commentateur4', 1, 2),
('Cet article m\'a beaucoup appris.', CURRENT_TIMESTAMP(), 'Commentateur5', 1, 3),
('Excellent contenu !', CURRENT_TIMESTAMP(), 'Commentateur6', 1, 4),
('Merci pour ces informations.', CURRENT_TIMESTAMP(), 'Commentateur7', 1, 4),
('Hâte de lire votre prochain article !', CURRENT_TIMESTAMP(), 'Commentateur8', 1, 5);

-- Insertion de données de test dans la table MESSAGE
INSERT INTO MESSAGE (pseudo, adresse_email, sujet, message, utilisateur_id) 
VALUES 
('Expéditeur1', 'expediteur1@example.com', 'Sujet du message 1', 'Contenu du message 1', 1),
('Expéditeur2', 'expediteur2@example.com', 'Sujet du message 2', 'Contenu du message 2', 2),
('Expéditeur3', 'expediteur3@example.com', 'Sujet du message 3', 'Contenu du message 3', 3),
('Expéditeur4', 'expediteur4@example.com', 'Sujet du message 4', 'Contenu du message 4', 4),
('Expéditeur5', 'expediteur5@example.com', 'Sujet du message 5', 'Contenu du message 5', 5);
