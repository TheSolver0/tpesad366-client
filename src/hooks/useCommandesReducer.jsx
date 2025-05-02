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

export function useCommandesReducer(commandes) {
   const [state, dispatch] = useReducer(reducer, initialState); // AJOUT OBLIGATOIRE
 
  useEffect(() => {
    const commandesLivrees = commandes.filter(c => c.statut === 'LIVREE');
  
    // Filtrage avec les données actuelles du localStorage (pas du state)
    const dejaTraitees = JSON.parse(localStorage.getItem('commandesLivrees')) || [];
  
    const nouvellesLivraisons = commandesLivrees.filter(
      cmd => !dejaTraitees.includes(cmd.id)
    );
  
    if (nouvellesLivraisons.length > 0) {
      console.log("Nouvelles livraisons via reducer:", nouvellesLivraisons);
  
      nouvellesLivraisons.forEach(cmd => {
        axios.post("http://localhost:8000/mouvements/", {
          type: "SORTIE",
          qte: cmd.qte,
          montant: cmd.montant,
          user : cmd.client,
          produits: cmd.produits
        });
  
        const newProduit = {
          ...cmd.produits_details,
          qte: cmd.produits_details.qte - cmd.qte,
        };
  
        axios.put(`http://localhost:8000/produits/${cmd.produits}/`, newProduit);
      });
  
      // Sauvegarde directe dans le localStorage
      const nouveauxIds = [...dejaTraitees, ...nouvellesLivraisons.map(c => c.id)];
      localStorage.setItem('commandesLivrees', JSON.stringify(nouveauxIds));
  
      // Met à jour le reducer
      dispatch({ type: "NOUVELLES_LIVRAISONS", payload: nouvellesLivraisons });
    }
  }, [commandes]);
  return state; // retourner l’état 
  
  }
  