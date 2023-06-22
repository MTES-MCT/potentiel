import { Message, MessageHandler, mediator } from 'mediateur';
import { Option, isNone, none } from '@potentiel/monads';
import {
  LegacyDossierRaccordementReadModel,
  DossierRaccordementReadModel,
  DossierRaccordementReadModelKey,
} from '../raccordement.readModel';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  RawRéférenceDossierRaccordement,
  RéférenceDossierRaccordement,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnIdentifiantProjet,
  estUneRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { Find } from '../../common.port';

export type ConsulterDossierRaccordementQuery = Message<
  'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement | RéférenceDossierRaccordement;
  },
  Option<DossierRaccordementReadModel>
>;

export type ConsulterDossierRaccordementDependencies = {
  find: Find;
};

export const registerConsulterDossierRaccordementQuery = ({
  find,
}: ConsulterDossierRaccordementDependencies) => {
  const queryHandler: MessageHandler<ConsulterDossierRaccordementQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;
    const rawRéférenceDossierRaccordement = estUneRéférenceDossierRaccordement(
      référenceDossierRaccordement,
    )
      ? convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement).formatter()
      : référenceDossierRaccordement;
    const key: DossierRaccordementReadModelKey = `dossier-raccordement#${rawIdentifiantProjet}#${rawRéférenceDossierRaccordement}`;
    const result = await find<LegacyDossierRaccordementReadModel>(key);

    if (isNone(result)) {
      return none;
    }

    const {
      référence,
      accuséRéception,
      dateMiseEnService,
      dateQualification,
      propositionTechniqueEtFinancière,
      type,
    } = result;

    const dossier: DossierRaccordementReadModel = {
      type,
      référence,
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception,
      },
      ...(dateMiseEnService ? { miseEnService: { dateMiseEnService } } : {}),
      ...(propositionTechniqueEtFinancière
        ? {
            propositionTechniqueEtFinancière: {
              dateSignature: propositionTechniqueEtFinancière.dateSignature,
              propositionTechniqueEtFinancièreSignée: {
                format: propositionTechniqueEtFinancière.format,
              },
            },
          }
        : {}),
    };

    return dossier;
  };

  mediator.register('CONSULTER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};
