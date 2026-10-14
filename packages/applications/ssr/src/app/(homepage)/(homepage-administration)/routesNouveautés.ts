import { Routes } from '@potentiel-applications/routes';

export const routesNouveautés = {
  'liste.demande.candidature': Routes.Candidature.lister(),
  'liste.demande.abandon': Routes.Abandon.lister(),
  'liste.demande.actionnaire': Routes.Actionnaire.changement.lister(),
  'liste.demande.délai': Routes.Délai.lister(),
  'liste.demande.fournisseur': Routes.Fournisseur.changement.lister,
  'liste.demande.installateur': Routes.Installation.changement.installateur.lister,
  'liste.demande.puissance': Routes.Puissance.changement.lister(),
  'liste.demande.producteur': Routes.Producteur.changement.lister,
  'liste.demande.recours': Routes.Recours.lister(),
  'liste.demande.représentantLégal': Routes.ReprésentantLégal.changement.lister(),
  'liste.demande.garantiesFinancièresÀTraiter': Routes.GarantiesFinancières.dépôt.lister(),
  'liste.demande.garantiesFinancièresEnAttente': Routes.GarantiesFinancières.enAttente.lister(),
  'liste.demande.mainlevées': Routes.GarantiesFinancières.demandeMainlevée.lister(),
  'liste.dossierRaccordement': Routes.Raccordement.lister,
  'liste.lauréat': Routes.Lauréat.lister(),
  'liste.éliminé': Routes.Éliminé.lister(),
  'liste.gestionnaireRéseau': Routes.Gestionnaire.lister,
  'liste.utilisateur': Routes.Utilisateur.lister(),
  'page.candidature.àNotifier': Routes.Période.lister(),
  'page.candidature.corrigerParLot': Routes.Candidature.corrigerParLot,
  'page.raccordement.corrigerRéférenceDossier': Routes.Raccordement.corrigerRéférencesDossier,
  'page.utilisateur.inviter': Routes.Utilisateur.inviter,
  'page.export': Routes.Export.page,
  'page.statistiquePublique': Routes.StatistiquesPubliques.consulter,
};

export type CléRouteNouveauté = keyof typeof routesNouveautés;

export const estUneCléDeRouteNouveauté = (value: string): value is CléRouteNouveauté =>
  Object.keys(routesNouveautés).includes(value);
