import { Option, isSome, none } from '@potentiel/monads';
import { AggregateFactory, LoadAggregate } from '@potentiel-domain/core';
import {
  IdentifiantProjetValueType,
  convertirEnIdentifiantProjet,
} from '../projet/projet.valueType';
import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DateMiseEnServiceTransmiseEventV1,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
  DemandeComplèteRaccordementTransmiseEventV1,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
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
import {
  GestionnaireRéseauProjet,
  loadGestionnaireRéseauProjetAggregateFactory,
} from '../projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.aggregate';

type RaccordementAggregateId = `raccordement|${string}`;

export const createRaccordementAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): RaccordementAggregateId => {
  return `raccordement|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type Raccordement = {
  getProjet(): Promise<Option<GestionnaireRéseauProjet>>;
  getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>>;
  dossiers: Map<string, DossierRaccordement>;
  contientLeDossier: (
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType,
  ) => boolean;
};

const getDefaultAggregate = (): Raccordement => ({
  getProjet: async () => Promise.resolve(none),
  getGestionnaireRéseau: async () => Promise.resolve(none),
  dossiers: new Map(),
  contientLeDossier: function ({ référence }) {
    return this.dossiers.has(référence);
  },
});

const raccordementAggregateFactory: AggregateFactory<Raccordement, RaccordementEvent> = (
  events,
  loadAggregate,
) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'DemandeComplèteDeRaccordementTransmise-V1':
        return ajouterDossier(aggregate, event, loadAggregate);
      case 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1':
        return ajouterAccuséRéceptionDemandeComplèteRaccordement(aggregate, event);
      case 'PropositionTechniqueEtFinancièreSignéeTransmise-V1':
        return ajouterPropositionTechniqueEtFinancièreSignée(aggregate, event);
      case 'DateMiseEnServiceTransmise-V1':
        return ajouterMiseEnService(aggregate, event);
      case 'PropositionTechniqueEtFinancièreTransmise-V1':
      case 'PropositionTechniqueEtFinancièreModifiée-V1':
        return modifierDateSignaturePropositionTechniqueEtFinancière(aggregate, event);
      case 'DemandeComplèteRaccordementModifiée-V1':
        return modifierDemandeComplèteRaccordement(aggregate, event);
      case 'DemandeComplèteRaccordementModifiée-V2':
        return modifierDemandeComplèteRaccordementV2(aggregate, event);
      case 'RéférenceDossierRacordementModifiée-V1':
        return modifierRéférenceDossierRacordement(aggregate, event);
      default:
        return { ...aggregate };
    }
  }, getDefaultAggregate());
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
  }: DemandeComplèteRaccordementTransmiseEventV1,
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
      const loadProjet = loadGestionnaireRéseauProjetAggregateFactory({
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
  }: DemandeComplèteRaccordementModifiéeEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, referenceActuelle);

  dossier.demandeComplèteRaccordement.dateQualification = new Date(dateQualification);
  dossier.référence = convertirEnRéférenceDossierRaccordement(nouvelleReference);

  aggregate.dossiers.delete(referenceActuelle);
  aggregate.dossiers.set(nouvelleReference, dossier);

  return aggregate;
};

const modifierDemandeComplèteRaccordementV2 = (
  aggregate: Raccordement,
  {
    payload: { dateQualification, référenceDossierRaccordement },
  }: DemandeComplèteRaccordementModifiéeEventV2,
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
  }: AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.demandeComplèteRaccordement.format = format;

  return aggregate;
};

const ajouterPropositionTechniqueEtFinancièreSignée = (
  aggregate: Raccordement,
  {
    payload: { référenceDossierRaccordement, format },
  }: PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.propositionTechniqueEtFinancière.format = format;

  return aggregate;
};

const ajouterMiseEnService = (
  aggregate: Raccordement,
  {
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceTransmiseEventV1,
): Raccordement => {
  const dossier = récupérerDossier(aggregate, référenceDossierRaccordement);

  dossier.miseEnService.dateMiseEnService = new Date(dateMiseEnService);

  return aggregate;
};

const modifierDateSignaturePropositionTechniqueEtFinancière = (
  aggregate: Raccordement,
  {
    payload: { dateSignature, référenceDossierRaccordement },
  }:
    | PropositionTechniqueEtFinancièreTransmiseEventV1
    | PropositionTechniqueEtFinancièreModifiéeEventV1,
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
  if (aggregate.dossiers.has(nouvelleRéférenceDossierRaccordement)) {
    return aggregate;
  }

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
