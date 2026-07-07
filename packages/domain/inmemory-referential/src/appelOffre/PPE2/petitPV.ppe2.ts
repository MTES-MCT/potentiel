import type { AppelOffre } from '@potentiel-domain/appel-offre';

import { petitPVBâtimentPPE2 } from './petitPVBâtiment.ppe2.js';

export const petitPVPPE2: AppelOffre.AppelOffreReadModel = {
  ...petitPVBâtimentPPE2,
  id: 'PPE2 - Petit PV',
  title: `portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « Centrales sur bâtiments ou ombrières ou au sol de puissance supérieure à 100 kWc et inférieure à 500 kWc »`,
  shortTitle: 'PPE2 - Petit PV',
  periodes: [
    // cet appel d'offres démarre avec la période 2 car fait suite à la première période de l'appel d'offres "PPE2 - Petit PV Bâtiment"
    {
      id: '2',
      title: 'deuxième',
      certificateTemplate: 'ppe2.v2',
      logo: 'Gouvernement',
      cahierDesCharges: {
        référence: '🦺 A COMPLETER 🦺',
      },
      familles: [],
      puissanceAppelée: 288,
      cahiersDesChargesModifiésDisponibles: [],
      // si CDC modifié ajouté, vérifier si retour au CDC initial possible
      champsSupplémentaires: {},
      addendums: {
        paragrapheECS:
          "Pour rappel, la conformité de l’autorisation d’urbanisme et  le respect du bilan carbone déclaré dans l’offre, arrondi au multiple de 10 le plus proche conformément au cahier des charges, fait l’objet d’une vérification pour la délivrance de l’attestation de conformité qui est obligatoire pour la prise d'effet du contrat",
        paragraphePrix:
          "Pour rappel, la méthodologie d'évaluation carbone repose désormais uniquement sur les valeurs d'émissions de gaz à effet de serre par pays données aux tableaux 3 de l'annexe 2 du cahier des charges.",
      },
      typeImport: 'démarche-numérique',
    },
  ],
};
