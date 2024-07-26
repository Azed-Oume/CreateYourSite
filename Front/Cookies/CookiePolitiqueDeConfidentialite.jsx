import React from 'react';
import ContactMe from '../src/compenents/App/ContactForm/Inscription/ContactMe';

const CookiePolitiqueDeConfidentialite = () => {
  return (
    <>
        <div className='container mt-5'>
            <h1>Politique de Confidentialité</h1>
            <p>Dernière mise à jour : 26/07/2024</p>
            <p>
                Chez digital web access, nous nous engageons à protéger et à respecter votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous visitez notre site web [https://dwaccess.com/] (dwaccess).
            </p>
            <h2>1. Informations que nous collectons</h2>
            <p>Nous pouvons collecter et traiter les données suivantes vous concernant :</p>
            <ul>
                <li><strong>Informations que vous nous fournissez :</strong> Lorsque vous remplissez des formulaires sur notre Site, vous nous fournissez des informations personnelles telles que votre nom, votre adresse e-mail, votre adresse postale, votre numéro de téléphone, etc.</li>
                <li><strong>Informations collectées automatiquement :</strong> Lorsque vous visitez notre Site, nous pouvons collecter automatiquement des informations techniques telles que votre adresse IP, votre type de navigateur, votre système d'exploitation, les pages que vous visitez, les durées de visite et d'autres données similaires.</li>
                <li><strong>Cookies :</strong> Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre Site. Les cookies sont des fichiers texte placés sur votre appareil pour collecter des informations standard de journal Internet et des informations sur le comportement des visiteurs.</li>
            </ul>
                <h2>Cookies Utilisés</h2>
                <ul>
                    <li><strong>__stripe_mid</strong>: Utilisé par Stripe pour gérer les sessions et les transactions sécurisées. Ce cookie est essentiel pour le traitement des paiements.</li>
                    <li><strong>__stripe_sid</strong>: Utilisé par Stripe pour maintenir la session de paiement. Ce cookie assure que les informations de paiement sont correctement traitées.</li>
                    <li><strong>user</strong>: Contient des informations personnalisées sur l'utilisateur, comme le nom ou les préférences. Ce cookie est utilisé pour offrir une expérience utilisateur personnalisée.</li>
                    <li><strong>cookieconsent_status</strong>: Utilisé pour mémoriser votre choix concernant les cookies. Ce cookie stocke l'état de votre consentement ou refus concernant la politique des cookies.</li>
                </ul>
            <h2>2. Utilisation des informations</h2>
            <p>Nous utilisons les informations que nous collectons pour :</p>
            <ul>
                <li>Fournir, exploiter et maintenir notre Site.</li>
                <li>Améliorer, personnaliser et développer notre Site.</li>
                <li>Comprendre et analyser comment vous utilisez notre Site.</li>
                <li>Communiquer avec vous, directement ou par l'intermédiaire de l'un de nos partenaires, y compris pour le service client, pour vous fournir des mises à jour et d'autres informations relatives au Site, et à des fins de marketing et promotionnelles.</li>
                <li>Traiter vos transactions et vous envoyer les informations correspondantes, y compris les confirmations de transaction et les factures.</li>
                <li>Détecter et prévenir la fraude et autres activités illégales.</li>
            </ul>
            <h2>3. Partage des informations</h2>
            <p>Nous pouvons partager vos informations personnelles dans les situations suivantes :</p>
            <ul>
                <li><strong>Avec votre consentement :</strong> Nous pouvons partager vos informations personnelles lorsque vous nous avez donné votre consentement spécifique pour le faire.</li>
                <li><strong>Fournisseurs de services :</strong> Nous pouvons partager vos informations avec des fournisseurs de services tiers qui nous aident à exploiter notre Site, à mener nos affaires ou à vous servir, tant que ces parties acceptent de garder ces informations confidentielles.</li>
                <li><strong>Pour se conformer à la loi :</strong> Nous pouvons divulguer vos informations lorsque nous pensons que la divulgation est nécessaire pour se conformer à la loi, faire respecter nos politiques de site ou protéger nos droits, notre propriété ou notre sécurité, ou ceux d'autrui.</li>
            </ul>
            <h2>4. Sécurité des informations</h2>
            <p>Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre l'accès, l'utilisation ou la divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sécurisée à 100 %, et nous ne pouvons garantir une sécurité absolue.</p>
            <h2>5. Vos droits</h2>
            <p>En vertu du RGPD et d'autres lois applicables sur la protection des données, vous avez des droits concernant vos informations personnelles, y compris :</p>
            <ul>
                <li>Le droit d'accès aux informations que nous détenons sur vous.</li>
                <li>Le droit de demander la correction de toute information incorrecte ou incomplète.</li>
                <li>Le droit de demander la suppression de vos informations personnelles.</li>
                <li>Le droit de restreindre ou de s'opposer au traitement de vos informations personnelles.</li>
                <li>Le droit à la portabilité des données.</li>
                <li>Le droit de retirer votre consentement à tout moment, lorsque le traitement des données est basé sur votre consentement.</li>
            </ul>
            <h2>6. Cookies et technologies de suivi</h2>
            <p>Nous utilisons des cookies pour améliorer votre expérience sur notre Site. Vous pouvez configurer votre navigateur pour refuser tous ou certains cookies, ou pour vous alerter lorsque des cookies sont envoyés. Toutefois, si vous désactivez ou refusez les cookies, certaines parties du Site peuvent devenir inaccessibles ou ne pas fonctionner correctement.</p>
            <h2>7. Modifications de cette politique</h2>
            <p>Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle politique de confidentialité sur cette page. Nous vous recommandons de consulter cette politique régulièrement pour toute mise à jour.</p>
            <h2>8. Nous contacter</h2>
            <p>Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse suivante :</p>
            <ContactMe />
        </div>
    </>
    );
    };

export default CookiePolitiqueDeConfidentialite;
