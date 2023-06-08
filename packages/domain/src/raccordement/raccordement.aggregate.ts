import { Option, none } from '@potentiel/monads';
import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjetValueType } from '../projet/projet.valueType';
import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEvent,
  DateMiseEnServiceTransmiseEvent,
  DemandeComplèteRaccordementModifiéeEventV0,
  DemandeComplèteRaccordementTransmiseEvent,
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreSignéeTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  RaccordementEvent,
} from './raccordement.event';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { convertirEnIdentifiantGestionnaireRéseau } from '../domain.valueType';
import {
  DossierRaccordement,
  RéférenceDossierRaccordementValueType,
  convertirEnRéférenceDossierRaccordement,
} from './raccordement.valueType';
import { DossierRaccordementNonRéférencéError } from './raccordement.errors';

type RaccordementAggregateId = `raccordement#${string}`;

export const createRaccordementAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): RaccordementAggregateId => {
  return `raccordement#${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type Raccordement = {
  getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>>;
  dossiers: Map<string, DossierRaccordement>;
  contientLeDossier: (
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType,
  ) => boolean;
};

const defaultAggregateState: Raccordement = {
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
    payload: { identifiantGestionnaireRéseau, référenceDossierRaccordement, dateQualification },
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
    getGestionnaireRéseau: async () => {
      const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
        loadAggregate,
      });
      return loadGestionnaireRéseau(
        convertirEnIdentifiantGestionnaireRéseau(identifiantGestionnaireRéseau),
      );
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

const récupérerDossier = (aggregate: Raccordement, référence: string) => {
  const dossier = aggregate.dossiers.get(référence);

  if (!dossier) {
    throw new DossierRaccordementNonRéférencéError();
  }

  return dossier;
};
