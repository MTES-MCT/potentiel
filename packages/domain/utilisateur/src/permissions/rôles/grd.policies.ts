import { Policy } from '../policies.js';

export const grdPolicies: ReadonlyArray<Policy> = [
  'historique.lister',

  'appelOffre.consulter',
  'cahierDesCharges.consulter',

  // NB : cette permission est trop large pour juste afficher le header projet,
  // un refacto pour avoir une permission dédiée serait préférable
  'lauréat.consulter',

  // Gestionnaire réseau
  'réseau.gestionnaire.consulter',

  // Raccordement
  'raccordement.consulter',
  'raccordement.listerDossierRaccordement',
  'raccordement.date-mise-en-service.transmettre',
  'raccordement.date-mise-en-service.modifier',
  'raccordement.référence-dossier.modifier',

  'api.raccordement.lister',
  'api.raccordement.transmettre',
  'api.raccordement.modifier',
];
