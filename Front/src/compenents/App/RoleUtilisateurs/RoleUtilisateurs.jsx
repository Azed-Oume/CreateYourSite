import React, { useEffect, useState } from "react";
import ReserveForUser from "../../AuthSecure/ReservForUser";
import ReserveForAdmin from "../../AuthSecure/ReserveForAdmin";

const RoleUtilisateurs = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [compenentsIsVisible, setCompenentsIsVisible] = useState(true);

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            const token = localStorage.getItem("token");

            const role = parseInt(localStorage.getItem('role'));
            console.log(role, "en ligne 15 XXXXXXXXXXXXX")  
            console.log(typeof role, "en ligne 15 XXXXXXXXXXXXX")  
            if(role !== 1){
                setCompenentsIsVisible(false);
                return;
            }
            try {
                const response = await fetch("http://localhost:3000/api/getAllUser", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.statusText}`);
                }

                const data = await response.json();
                setUtilisateurs(data);
            } catch (error) {
                (error.message);
            } 
        };

        fetchUtilisateurs();
    }, []);

    const handleStatusChange = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:3000/api/updateUserStatut/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ statut: 2 }) // Remplacez "NOUVEAU_STATUT" par le statut souhaité
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.statusText}`);
            }

            const utilisateur = await response.json();
            console.log(utilisateur, " en ligne 63 XXXXXXXX");

            // Mettre à jour le statut localement
            setUtilisateurs(utilisateurs.map(user =>
                user.id === userId ? { ...user, statut: utilisateur.statut } : user
            ));
            
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
            setError("Erreur lors de la mise à jour du statut");
        }
    };

    return (
        <>            
        <section className="container graylogo p-4 mt-5 rounded-4 mx-auto" aria-labelledby="role-utilisateurs-heading">
            
        { compenentsIsVisible ? (
            <div>
            <h2 id="role-utilisateurs-heading" className="sr-only">Liste des utilisateurs et leurs rôles</h2>
            <article className="mx-auto table-responsive">
                <table className="table table-striped table-bordered" aria-describedby="table-description">
                    <caption id="table-description" className="visually-hidden">
                        Tableau listant les utilisateurs avec leurs avatars, noms, prénoms, sociétés, téléphones, pseudos, villes, statuts et rôles
                    </caption>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Avatar</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Prénom</th>
                            <th scope="col">Société</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Pseudo</th>
                            <th scope="col">Ville</th>
                            <th scope="col">Statut</th>
                            <th scope="col">Action</th>
                            <th scope="col">Rôle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateurs.map((utilisateur, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={utilisateur.avatar} alt={`Avatar de ${utilisateur.prenom} ${utilisateur.nom}`} className="rounded-circle" width="50" height="50" />
                                </td>
                                <td>{utilisateur.nom}</td>
                                <td>{utilisateur.prenom}</td>
                                <td>{utilisateur.societe}</td>
                                <td>{utilisateur.telephone}</td>
                                <td>{utilisateur.pseudo}</td>
                                <td>{utilisateur.ville}</td>
                                <td>{utilisateur.statut}</td>
                                <td>
                                    <button className="btn btn-success" onClick={() => handleStatusChange(utilisateur.utilisateur_id)}>Valider</button>
                                </td>
                                <td>{utilisateur.role_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
            </div>
        ) : (
        <ReserveForAdmin/>
        )}
        </section>
        
        </>
    );
};

export default RoleUtilisateurs;
