import { LoadAggregate } from '@potentiel-domain/core';
import {
  ConsulterGarantiesFinancièresDependencies,
  registerConsulterGarantiesFinancièresQuery,
} from './garantiesFinancièresActuelles/consulter/consulterGarantiesFinancières.query';
import { registerDépôtSoumettreGarantiesFinancièresCommand } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.command';
import { registerDemanderGarantiesFinancièresCommand } from './demander/demanderGarantiesFinancières.command';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './dépôtEnCours/soumettreDépôt/soumettreDépôtGarantiesFinancières.usecase';
import { registerDemanderGarantiesFinancièresUseCase } from './demander/demanderGarantiesFinancières.usecase';
import { registerSupprimerDépôtGarantiesFinancièresEnCoursCommand } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.command';
import { registerSupprimerGarantiesFinancièresÀTraiterUseCase } from './dépôtEnCours/supprimerDépôtEnCours/supprimerDépôtGarantiesFinancièresEnCours.usecase';
import { registerValiderDépôtGarantiesFinancièresEnCoursCommand } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.command';
import { registerValiderDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/validerDépôtEnCours/validerDépôtGarantiesFinancièresEnCours.usecase';
import { registerModifierDépôtGarantiesFinancièresEnCoursUseCase } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.usecase';
import { registerModifierDépôtGarantiesFinancièresEnCoursCommand } from './dépôtEnCours/modifierDépôtEnCours/modifierDépôtGarantiesFinancièresEnCours.command';

import {
  ListerDépôtsEnCoursGarantiesFinancièresDependencies,
  registerListerDépôtsEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/lister/listerDépôtsEnCoursGarantiesFinancières.query';
import { registerEffacerHistoriqueGarantiesFinancièresCommand } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.command';
import { registerEffacerHistoriqueGarantiesFinancièresUseCase } from './effacerHistorique/effacerHistoriqueGarantiesFinancières.usecase';
import { registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/lister/listerProjetsAvecGarantiesFinancièresEnAttente.query';
import { registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery } from './projetEnAttenteDeGarantiesFinancières/consulter/consulterProjetAvecGarantiesFinancièresEnAttente.query';

import {
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies,
  registerConsulterDépôtEnCoursGarantiesFinancièresQuery,
} from './dépôtEnCours/consulter/consulterDépôtEnCoursGarantiesFinancières.query';
import {
  GénérerModèleMiseEnDemeureGarantiesFinancièresDependencies,
  registerGénérerModèleMiseEnDemeureGarantiesFinancièresQuery,
} from './projetEnAttenteDeGarantiesFinancières/générerModèleMiseEnDemeure/générerModèleMiseEnDemeure.query';
import { registerEnregistrerGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/enregistrer/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { registerImporterTypeGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.command';
import { registerImporterTypeGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/importer/importerTypeGarantiesFinancières.usecase';
import { registerModifierGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.command';
import { registerModifierGarantiesFinancièresUseCase } from './garantiesFinancièresActuelles/modifier/modifierGarantiesFinancières.usecase';
import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.command';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.usecase';

import { registerListerDemandeMainlevéeQuery } from './mainlevée/lister/listerDemandeMainlevéeGarantiesFinancières.query';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './mainlevée/annuler/annulerDemandeMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières } from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import { registeRejeterDemandeMainlevéeGarantiesFinancièresCommand } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.command';
import { registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';
import { registeAccorderDemandeMainlevéeGarantiesFinancièresCommand } from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.command';
import { registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './mainlevée/accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import {
  ConsulterMainlevéeGarantiesFinancièresDependencies,
  registerConsulterMainlevéeGarantiesFinancièresQuery,
} from './mainlevée/consulter/consulterMainlevéeGarantiesFinancières.query';

export type GarantiesFinancièresQueryDependencies = ConsulterGarantiesFinancièresDependencies &
  ListerDépôtsEnCoursGarantiesFinancièresDependencies &
  GénérerModèleMiseEnDemeureGarantiesFinancièresDependencies &
  ConsulterDépôtEnCoursGarantiesFinancièresDependencies &
  ConsulterMainlevéeGarantiesFinancièresDependencies;

export type GarantiesFinancièresCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerGarantiesFinancièresUseCases = ({
  loadAggregate,
}: GarantiesFinancièresCommandDependencies) => {
  registerDépôtSoumettreGarantiesFinancièresCommand(loadAggregate);
  registerDemanderGarantiesFinancièresCommand(loadAggregate);
  registerSupprimerDépôtGarantiesFinancièresEnCoursCommand(loadAggregate);
  registerValiderDépôtGarantiesFinancièresEnCoursCommand(loadAggregate);
  registerModifierDépôtGarantiesFinancièresEnCoursCommand(loadAggregate);
  registerImporterTypeGarantiesFinancièresCommand(loadAggregate);
  registerModifierGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerAttestationGarantiesFinancièresCommand(loadAggregate);
  registerEnregistrerGarantiesFinancièresCommand(loadAggregate);
  registerEffacerHistoriqueGarantiesFinancièresCommand(loadAggregate);

  registerDemanderMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registerAnnulerMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières(loadAggregate);
  registeRejeterDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registeAccorderDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);

  registerSoumettreDépôtGarantiesFinancièresUseCase();
  registerDemanderGarantiesFinancièresUseCase();
  registerSupprimerGarantiesFinancièresÀTraiterUseCase();
  registerValiderDépôtGarantiesFinancièresEnCoursUseCase();
  registerModifierDépôtGarantiesFinancièresEnCoursUseCase();
  registerImporterTypeGarantiesFinancièresUseCase();
  registerModifierGarantiesFinancièresUseCase();
  registerEnregistrerAttestationGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
  registerEffacerHistoriqueGarantiesFinancièresUseCase();

  registerDemanderMainlevéeGarantiesFinancièresUseCase();
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase();
  registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase();
  registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase();
};

export const registerGarantiesFinancièresQueries = (
  dependencies: GarantiesFinancièresQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerConsulterProjetAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerListerDépôtsEnCoursGarantiesFinancièresQuery(dependencies);
  registerListerProjetsAvecGarantiesFinancièresEnAttenteQuery(dependencies);
  registerGénérerModèleMiseEnDemeureGarantiesFinancièresQuery(dependencies);
  registerConsulterDépôtEnCoursGarantiesFinancièresQuery(dependencies);
  registerConsulterMainlevéeGarantiesFinancièresQuery(dependencies);
  registerListerDemandeMainlevéeQuery(dependencies);
};
