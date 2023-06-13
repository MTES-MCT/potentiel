import { Option, isSome, none } from '@potentiel/monads';
import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  IdentifiantProjetValueType,
  convertirEnIdentifiantProjet,
} from '../projet/projet.valueType';
import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
  DateMiseEnServiceTransmiseEvent,
  DemandeComplèteRaccordementModifiéeEventV0,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementTransmiseEvent,
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreSignéeTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  RaccordementEvent,
  RéférenceDossierRacordementModifiéeEventV1,
} from './raccordement.event';
import { GestionnaireRéseau } from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import {
  DossierRaccordement,
  RéférenceDossierRaccordementValueType,
  convertirEnRéférenceDossierRaccordement,
} from './raccordement.valueType';
import { DossierRaccordementNonRéférencéError } from './raccordement.errors';
import { Projet, loadProjetAggregateFactory } from '../projet/projet.aggregate';

type RaccordementAggregateId = `raccordement#${string}`;

export const createRaccordementAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): RaccordementAggregateId => {
  return `raccordement#${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type Raccordement = {
  getProjet(): Promise<Option<Projet>>;
  getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>>;
  dossiers: Map<string, DossierRaccordement>;
  contientLeDossier: (
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType,
  ) => boolean;
};

const defaultAggregateState: Raccordement = {
  getProjet: async () => Promise.resolve(none),
  getGestionnaireRéseau: async () => Promise.resolve(none),
  dossiers: new Map(),
  contientLeDossier({ référence }) {
    return this.dossiers.has(référence);
  },
};

const raccordementAggregateFactory: AggregateFactory<Raccordement, RaccordementEvent> = (
  events,
  loadAggregate,
) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'DemandeComplèteDeRaccordementTransmise':
        return ajouterDossier(aggregate, event, loadAggregate);
      case 'AccuséRéceptionDemandeComplèteRaccordementTransmis':
        return ajouterAccuséRéceptionDemandeComplèteRaccordement(aggregate, event);
      case 'PropositionTechniqueEtFinancièreSignéeTransmise':
        return ajouterPropositionTechniqueEtFinancièreSignée(aggregate, event);
      case 'DateMiseEnServiceTransmise':
        return ajouterMiseEnService(aggregate, event);
      case 'PropositionTechniqueEtFinancièreTransmise':
      case 'PropositionTechniqueEtFinancièreModifiée':
        return modifierDateSignaturePropositionTechniqueEtFinancière(aggregate, event);
      case 'DemandeComplèteRaccordementModifiée':
        return modifierDemandeComplèteRaccordement(aggregate, event);
      case 'DemandeComplèteRaccordementModifiée-V1':
        return modifierDemandeComplèteRaccordementV1(aggregate, event);
      case 'RéférenceDossierRacordementModifiée-V1':
        return modifierRéférenceDossierRacordement(aggregate, event);
      default:
        return { ...aggregate };
    }
  }, defaultAggregateState);
};

export const loadRaccordementAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<Raccordement, RaccordementEvent>(
      createRaccordementAggregateId(identifiantProjet),
      raccordementAggregateFactory,
    );
  };
};

const ajouterDossier = (
  aggregate: Raccordement,
  {
    payload: { identifiantProjet, référenceDossierRaccordement, dateQualification },
  }: DemandeComplèteRaccordementTransmiseEvent,
  loadAggregate: LoadAggregate,
): Raccordement => {
  aggregate.dossiers.set(référenceDossierRaccordement, {
    demandeComplèteRaccordement: {
      dateQualification: dateQualification ? new Date(dateQualification) : none,
      format: none,
    },
    miseEnService: {
      dateMiseEnService: none,
    },
    propositionTechniqueEtFinancière: {
      dateSignature: none,
      format: none,
    },
    référence: convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement),
  });

  return {
    ...aggregate,
    getProjet: async function () {
      const loadProjet = loadProjetAggregateFactory({
        loadAggregate,
      });
      return loadProjet(convertirEnIdentifiantProjet(identifiantProjet));
    },
    getGestionnaireRéseau: async function () {
      const projet = await this.getProjet();

      if (isSome(projet)) {
        return await projet.getGestionnaireRéseau();
      }
      return none;
    },
  };
};

const modifierDemandeComplèteRaccordement = (
  aggregate: Raccordement,
  {
    payload: { dateQualification, referenceActuelle, nouvelleReference },
  }: DemandeComplèteRaccordementModifiéeEventV0,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, referenceActuelle);

  dossier.demandeComplèteRaccordement.dateQualification = new Date(dateQualification);
  dossier.référence = convertirEnRéférenceDossierRaccordement(nouvelleReference);

  aggregate.dossiers.delete(referenceActuelle);
  aggregate.dossiers.set(nouvelleReference, dossier);

  return aggregate;
};

const modifierDemandeComplèteRaccordementV1 = (
  aggregate: Raccordement,
  {
    payload: { dateQualification, référenceDossierRaccordement },
  }: DemandeComplèteRaccordementModifiéeEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.dateQualification = new Date(dateQualification);
  dossier.référence = convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement);

  return aggregate;
};

const ajouterAccuséRéceptionDemandeComplèteRaccordement = (
  aggregate: Raccordement,
  {
    payload: { format, référenceDossierRaccordement },
  }: AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.format = format;

  return aggregate;
};

const ajouterPropositionTechniqueEtFinancièreSignée = (
  aggregate: Raccordement,
  {
    payload: { référenceDossierRaccordement, format },
  }: PropositionTechniqueEtFinancièreSignéeTransmiseEvent,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.format = format;

  return aggregate;
};

const ajouterMiseEnService = (
  aggregate: Raccordement,
  { payload: { dateMiseEnService, référenceDossierRaccordement } }: DateMiseEnServiceTransmiseEvent,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.miseEnService.dateMiseEnService = new Date(dateMiseEnService);

  return aggregate;
};

const modifierDateSignaturePropositionTechniqueEtFinancière = (
  aggregate: Raccordement,
  {
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreTransmiseEvent | PropositionTechniqueEtFinancièreModifiéeEvent,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.dateSignature = new Date(dateSignature);

  return aggregate;
};

const modifierRéférenceDossierRacordement = (
  aggregate: Raccordement,
  {
    payload: { nouvelleRéférenceDossierRaccordement, référenceDossierRaccordementActuelle },
  }: RéférenceDossierRacordementModifiéeEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordementActuelle);
  dossier.référence = convertirEnRéférenceDossierRaccordement(nouvelleRéférenceDossierRaccordement);

  aggregate.dossiers.delete(référenceDossierRaccordementActuelle);
  aggregate.dossiers.set(nouvelleRéférenceDossierRaccordement, dossier);

  return aggregate;
};

const récupérerDossier = (aggregate: Raccordement, référence: string) => {
  const dossier = aggregate.dossiers.get(référence);

  if (!dossier) {
    throw new DossierRaccordementNonRéférencéError();
  }

  return dossier;
};
