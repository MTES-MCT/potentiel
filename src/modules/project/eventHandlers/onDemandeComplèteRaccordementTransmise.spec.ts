import { okAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';
import {
  fakeTransactionalRepo,
  makeFakeProject as makeFakeProjectAggregate,
} from '../../../__tests__/fixtures/aggregates';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { ProjectAppelOffre } from '../../../entities';
import { CahierDesChargesModifié } from '@potentiel-domain/appel-offre';
import { Project } from '../Project';
import { DemandeComplèteRaccordementTransmise } from '../events';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { makeOnDemandeComplèteRaccordementTransmise } from './onDemandeComplèteRaccordementTransmise';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../helpers/dataToValueTypes';

describe(`Handler onDemandeComplèteRaccordementTransmise`, () => {
  const projetId = new UniqueEntityID();
  const appelOffreId = 'Eolien';
  const periodeId = '1';
  const numeroCRE = '123';
  const familleId = '';
  const dateAchèvementInitiale = new Date('2024-01-01').getTime();

  const findProjectByIdentifiers = jest.fn(() => okAsync(projetId.toString()));

  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

  const getProjectAppelOffre = jest.fn(
    () =>
      ({
        typeAppelOffre: 'eolien',
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              type: 'modifié',
              paruLe: '30/08/2022',
              délaiApplicable: {
                délaiEnMois: 18,
                intervaleDateMiseEnService: {
                  min: new Date('2022-06-01'),
                  max: new Date('2024-09-30'),
                },
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        },
      } as ProjectAppelOffre),
  );

  beforeEach(async () => {
    publishToEventStore.mockClear();
  });

  describe(`Retirer le délai appliqué au projet relatif au CDC 2022 si une nouvelle DCR est transmise`, () => {
    it(`Etant donné un projet éolien
        Et ayant déjà bénéficié du délai CDC 2022
        Quand une nouvelle demande complète de raccordement est transmise
        Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022appliqué: true,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const onDemandeComplèteRaccordementTransmise = makeOnDemandeComplèteRaccordementTransmise({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
        findProjectByIdentifiers,
      });

      const événementDemandeComplèteRaccordementTransmise =
        new DemandeComplèteRaccordementTransmise({
          payload: {
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: formatProjectDataToIdentifiantProjetValueType({
              appelOffreId,
              periodeId: periodeId,
              familleId,
              numeroCRE,
            }).formatter(),
            identifiantGestionnaireRéseau: 'codeEIC',
          },
        });

      await onDemandeComplèteRaccordementTransmise(événementDemandeComplèteRaccordementTransmise);

      const nouvelleDateAchèvementAttendue = new Date(
        new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() - 18),
      );

      expect(publishToEventStore).toHaveBeenCalledTimes(1);
      const évènement = publishToEventStore.mock.calls[0][0];
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet');
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022',
        }),
      );
    });
  });

  describe(`Cas où le projet n'a pas bénéficié du délai relatif au CDC 2022`, () => {
    it(`Etant donné un projet éolien
        Et n'ayant pas bénéficié du délai CDC 2022
        Quand une nouvelle demande complète de raccordement est transmise
        Alors la date d'achèvement du projet ne devrait pas être modifiée`, async () => {
      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const onDemandeComplèteRaccordementTransmise = makeOnDemandeComplèteRaccordementTransmise({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
        findProjectByIdentifiers,
      });

      const événementDemandeComplèteRaccordementTransmise =
        new DemandeComplèteRaccordementTransmise({
          payload: {
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: formatProjectDataToIdentifiantProjetValueType({
              appelOffreId,
              periodeId,
              familleId,
              numeroCRE,
            }).formatter(),

            identifiantGestionnaireRéseau: 'codeEIC',
          },
        });

      await onDemandeComplèteRaccordementTransmise(événementDemandeComplèteRaccordementTransmise);

      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });
});
