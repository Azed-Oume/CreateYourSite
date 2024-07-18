import React, { useEffect, useState } from "react";
import ReserveForAdmin from "../../AuthSecure/ReserveForAdmin";

const RoleUtilisateurs = () => {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [componentsIsVisible, setComponentsIsVisible] = useState(true);

    useEffect(() => {
        const fetchUtilisateurs = async () => {
            const token = localStorage.getItem("token");
            const role = parseInt(localStorage.getItem('role'));

            if (role !== 1) {
                setComponentsIsVisible(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getAllUser`, {
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
                console.error(error.message);
            }
        };

        fetchUtilisateurs();
    }, []);

    const handleStatusChange = async (userId, currentStatus) => {
        const token = localStorage.getItem("token");
        const newStatus = currentStatus === "3" ? "0" : "3";

        try {
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/updateUserStatut/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ statut: newStatus })
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.statusText}`);
            }

            setUtilisateurs(prevUtilisateurs => 
                prevUtilisateurs.map(user =>
                    user.utilisateur_id === userId ? { ...user, statut: newStatus } : user
                )
            );

            alert(`Le compte est ${newStatus === "3" ? 'valider' : 'suspendu'}`);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut :", error);
            alert("Une erreur est survenue lors de la mise à jour du statut.");
        }
    };

    return (
        <>            
            <section className="container graylogo p-4 mt-5 rounded-4 mx-auto" aria-labelledby="role-utilisateurs-heading">
                { componentsIsVisible ? (
                    <div>
                        <h2 id="role-utilisateurs-heading" className="sr-only">Liste des utilisateurs et leurs rôles</h2>
                        <article className="mx-auto table-responsive">
                            <table className="table table-striped table-bordered " role="table" aria-describedby="table-description">
                                <caption id="table-description" className="visually-hidden">
                                    Tableau listant les utilisateurs avec leurs avatars, noms, prénoms, sociétés, téléphones, pseudos, villes, statuts et rôles
                                </caption>
                                <thead className="thead-dark ">
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
                                            <button
                                                className={`btn ${utilisateur.statut === "3" ? 'btn-success' : 'btn-danger'}`}
                                                onClick={() => handleStatusChange(utilisateur.utilisateur_id, utilisateur.statut)}
                                            >
                                                {utilisateur.statut === "3" ? 'Suspendre' : 'Valider'}
                                            </button>

                                            </td>
                                            <td>{utilisateur.role_id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </article>
                    </div>
                ) : (
                    <ReserveForAdmin />
                )}
            </section>
        </>
    );
};

export default RoleUtilisateurs;
