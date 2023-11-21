// const TEMPLATE_ID_BY_TYPE = {
//   designation: 1350523,
//   'project-invitation': 1402576,
//   'dreal-invitation': 1436254,
//   'pp-gf-notification': 1463065,
//   'dreal-gf-notification': 1528696,
//   'pp-certificate-updated': 1765851,
//   'modification-request-status-update': 2046625,
//   'pp-délai-accordé-corrigé': 4554290,
//   'user-invitation': 2814281,
//   'modification-request-confirmed': 2807220,
//   'modification-request-cancelled': 2060611,
//   'dreal-modification-received': 2857027,
//   'pp-modification-received': 4183039,
//   'admin-modification-requested': 2047347,
//   'legacy-candidate-notification': 3075029,
//   'accès-utilisateur-révoqués': 4177049,
//   'pp-cdc-modifié-choisi': 4237729,
//   'pp-cdc-initial-choisi': 4237739,
//   'pp-delai-cdc-2022-appliqué': 4316228,
//   'dreals-delai-cdc-2022-appliqué': 4326138,
//   'tous-rôles-sauf-dgec-et-porteurs-nouvelle-periode-notifiée': 3849728,
//   'changement-cdc-annule-delai-cdc-2022': 5166575,
//   'date-mise-en-service-transmise-annule-delai-cdc-2022': 5169667,
//   'demande-complete-raccordement-transmise-annule-delai-Cdc-2022': 5219626,
// };

export const templateId = {
  abandon: {
    accorder: {
      porteur: '5330091',
    },
    annuler: {
      porteur: '5330331',
      admin: '5330344',
      chargéAffaire: '5330344',
    },
    annulerRejet: {
      porteur: '',
    },
    confirmer: {
      porteur: '5330500',
      admin: '5330535',
      chargéAffaire: '5330535',
    },
    demander: {
      porteur: '5330166',
      admin: '5330210',
    },
    demanderConfirmation: { porteur: '5330451' },
    demanderPreuveRecandidature: {
      porteur: '',
    },
    rejeter: { porteur: '5330129' },
    transmetrePreuveRecandidature: { porteur: '5308275' },
  },
};
