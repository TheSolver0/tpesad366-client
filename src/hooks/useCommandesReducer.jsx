import { useReducer, useEffect } from "react";
import axios from "axios";

const initialState = {
    dejaTraitees: JSON.parse(localStorage.getItem('commandesLivrees')) || [], // Récupère les commandes livrées précédemment
  };
  
  function reducer(state, action) {
    switch (action.type) {
      case "NOUVELLES_LIVRAISONS":
        // Met à jour l'état et sauvegarde dans localStorage
        const nouvellesLivrees = [...state.dejaTraitees, ...action.payload.map(c => c.id)];
        localStorage.setItem('commandesLivrees', JSON.stringify(nouvellesLivrees));
        return {
          ...state,
          dejaTraitees: nouvellesLivrees,
        };
      default:
        return state;
    }
  }

  function useLivraisonsReducer(commandes) {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    useEffect(() => {
      const commandesLivrees = commandes.filter(c => c.statut === 'LIVREE');
  
      const nouvellesLivraisons = commandesLivrees.filter(
        cmd => !state.dejaTraitees.includes(cmd.id)
      );
  
      if (nouvellesLivraisons.length > 0) {
        console.log("Nouvelles livraisons via reducer:", nouvellesLivraisons);
  
        nouvellesLivraisons.forEach(cmd => {
          axios.post("http://localhost:8000/mouvements/", {
            type: "ENTREE",
            qte: cmd.qte,
            montant: cmd.montant,
            userC: cmd.userC,
            // description: `Commande livrée : ${cmd.id}`,
          });
  
          const newProduit = {
            ...cmd.produits_details,
            qte: cmd.produits_details.qte - cmd.qte,
          };
  
          axios.put(`http://localhost:8000/produits/${cmd.produits}/`, newProduit);
        });
  
        //  Met à jour l’état des commandes déjà traitées
        dispatch({ type: "NOUVELLES_LIVRAISONS", payload: nouvellesLivraisons });
      }
    }, [commandes, state.dejaTraitees]);
  }

export function useCommandesReducer(commandes) {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    useEffect(() => {
      const commandesLivrees = commandes.filter(c => c.statut === 'LIVREE');
  
      const nouvellesLivraisons = commandesLivrees.filter(
        cmd => !state.dejaTraitees.includes(cmd.id)
      );
  
      if (nouvellesLivraisons.length > 0) {
        console.log(" Nouvelles livraisons via reducer:", nouvellesLivraisons);
  
        nouvellesLivraisons.forEach(cmd => {
          axios.post("http://localhost:8000/mouvements/", {
            type: "ENTREE",
            qte: cmd.qte,
            montant: cmd.montant,
            userC: cmd.userC,
            // description: `Commande livrée : ${cmd.id}`,
          });
          const newProduit = {
            ...cmd.produits_details,
            qte: cmd.produits_details.qte - cmd.qte,
          };
  
          axios.put(`http://localhost:8000/produits/${cmd.produits}/`, newProduit);
        });
  
        //  Met à jour l’état des commandes déjà traitées
        dispatch({ type: "NOUVELLES_LIVRAISONS", payload: nouvellesLivraisons });
      }
    }, [commandes, state.dejaTraitees]);
  }
  