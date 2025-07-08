import { LoadAggregate } from '@potentiel-domain/core';

import { GetProjetAggregateRoot } from '..';

import { registerChoisirCahierDesChargesCommand } from './cahierDesCharges/choisir/choisirCahierDesCharges.command';
import { registerChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesChoisiDependencies,
  registerConsulterCahierDesChargesChoisiQuery,
} from './cahierDesCharges/consulter/consulterCahierDesChargesChoisi.query';
import {
  ConsulterLauréatDependencies,
  registerConsulterLauréatQuery,
} from './consulter/consulterLauréat.query';
import { registerModifierLauréatCommand } from './modifier/modifierLauréat.command';
import { registerModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { registerNotifierLauréatCommand } from './notifier/notifierLauréat.command';
import { registerNotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
import { DélaiQueryDependencies, registerDélaiQueries } from './délai';
import { registerProducteurUseCases, registerProducteurQueries } from './producteur';
import { ProducteurQueryDependencies } from './producteur/producteur.register';
import {
  registerAchèvementQueries,
  registerAchèvementUseCases,
} from './achèvement/achèvement.register';
import {
  PuissanceQueryDependencies,
  registerPuissanceQueries,
  registerPuissanceUseCases,
} from './puissance/puissance.register';
import {
  AbandonQueryDependencies,
  registerAbandonQueries,
  registerAbandonUseCases,
} from './abandon/abandon.register';
import {
  FournisseurQueryDependencies,
  registerFournisseurQueries,
  registerFournisseurUseCases,
} from './fournisseur/fournisseur.register';
import {
  ActionnaireQueryDependencies,
  registerActionnaireQueries,
  registerActionnaireUseCases,
} from './actionnaire/actionnaire.register';
import {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
  ReprésentantLégalQueryDependencies,
} from './représentantLégal/représentantLégal.register';
import {
  RaccordementQueryDependencies,
  registerRaccordementQueries,
  registerRaccordementUseCases,
} from './raccordement/raccordement.register';
import {
  ListerHistoriqueProjetDependencies,
  registerListerHistoriqueProjetQuery,
} from './historique/lister/listerHistoriqueProjet.query';
import { SupprimerDocumentProjetSensibleCommandDependencies } from './représentantLégal/changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export type LauréatQueryDependencies = ConsulterLauréatDependencies &
  ConsulterCahierDesChargesChoisiDependencies &
  DélaiQueryDependencies &
  ProducteurQueryDependencies &
  PuissanceQueryDependencies &
  FournisseurQueryDependencies &
  AbandonQueryDependencies &
  ActionnaireQueryDependencies &
  ReprésentantLégalQueryDependencies &
  RaccordementQueryDependencies &
  ReprésentantLégalQueryDependencies &
  ListerHistoriqueProjetDependencies;

// à supprimer une fois gestionnaire de réseau migré dans l'AR
type GestionnaireRéseauCommandDependencies = { loadAggregate: LoadAggregate };

export type LauréatCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & GestionnaireRéseauCommandDependencies &
  SupprimerDocumentProjetSensibleCommandDependencies;

export const registerLauréatUseCases = (dependencies: LauréatCommandDependencies) => {
  registerNotifierLauréatCommand(dependencies.getProjetAggregateRoot);
  registerNotifierLauréatUseCase();

  registerModifierLauréatCommand(dependencies.getProjetAggregateRoot);
  registerModifierLauréatUseCase();

  registerChoisirCahierDesChargesUseCase();
  registerChoisirCahierDesChargesCommand(dependencies.getProjetAggregateRoot);

  registerProducteurUseCases(dependencies);
  registerAchèvementUseCases(dependencies);
  registerPuissanceUseCases(dependencies);
  registerActionnaireUseCases(dependencies);
  registerReprésentantLégalUseCases(dependencies);
  registerAbandonUseCases(dependencies);
  registerFournisseurUseCases(dependencies);
  registerRaccordementUseCases(dependencies);
};

export const registerLauréatQueries = (dependencies: LauréatQueryDependencies) => {
  registerConsulterLauréatQuery(dependencies);
  registerConsulterCahierDesChargesChoisiQuery(dependencies);

  registerDélaiQueries(dependencies);
  registerProducteurQueries(dependencies);
  registerAchèvementQueries(dependencies);
  registerPuissanceQueries(dependencies);
  registerAbandonQueries(dependencies);
  registerFournisseurQueries(dependencies);
  registerActionnaireQueries(dependencies);
  registerReprésentantLégalQueries(dependencies);
  registerRaccordementQueries(dependencies);

  registerListerHistoriqueProjetQuery(dependencies);
};
