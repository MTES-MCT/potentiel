import { okAsync } from '@core/utils';
import { InfraNotAvailableError } from '@modules/shared';
import {
  fakeTransactionalRepo,
  makeFakeProject as makeFakeProjectAggregate,
} from '../../../__tests__/fixtures/aggregates';
import makeFakeProject from '../../../__tests__/fixtures/project';
import { makeOnDateMiseEnServiceTransmise } from './onDateMiseEnServiceTransmise';
import { DomainEvent, UniqueEntityID } from '@core/domain';
import { CahierDesChargesModifié, ProjectAppelOffre } from '@entities';
import { Project } from '../Project';
import { DateMiseEnServiceTransmiseEvent } from 'packages/domain/src/raccordement/transmettreDateMiseEnService/dateMiseEnServiceTransmise.event';
import { resetDatabase } from '@infra/sequelize/helpers';
import { Project as ProjectModel } from '@infra/sequelize/projectionsNext';

describe(`Handler onDateMiseEnServiceTransmise`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

  beforeEach(async () => {
    await publishToEventStore.mockClear();
    await resetDatabase();
  });

  const dateAchèvementInitiale = new Date('2024-01-01').getTime();

  const nouvelleDateAchèvementAttendue = new Date(
    new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() + 18),
  );

  describe(`Projet pouvant bénéficier du délai de 18 mois`, () => {
    it(`Etant donné un projet éolien,
      dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
      ayant souscrit au CDC 2022,
      n'ayant pas déjà bénéficié du délai,
      alors le délai de 18 mois en lien avec le CDC 2022 devrait être appliqué`, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';

      const projet = makeFakeProject({
        id: projetId.toString(),
        appelOffreId,
        periodeId,
        numeroCRE,
      });

      try {
        await ProjectModel.create(projet);
      } catch (error) {
        console.log(error);
      }

      const getProjectAppelOffre = jest.fn(
        () =>
          ({
            type: 'eolien',
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
          } as ProjectAppelOffre),
      );
      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022Appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
      });

      const événementDateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEvent = {
        type: 'DateMiseEnServiceTransmise',
        payload: {
          dateMiseEnService: new Date('01/01/2023').toISOString(),
          référenceDossierRaccordement: '',
          identifiantProjet: 'Eolien#1##001',
        },
      };

      await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

      expect(publishToEventStore).toHaveBeenCalledTimes(1);
      const évènement = publishToEventStore.mock.calls[0][0];
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet');
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'délaiCdc2022',
        }),
      );
    });
  });

  // describe(`Projets ne pouvant pas bénéficier du délai de 18 mois`, () => {
  //   describe(`Dates hors limites`, () => {
  //     describe(`Projets PV`, () => {
  //       for (const type of ['batiment', 'innovation', 'sol', 'zni', 'autre']) {
  //         const getProjectAppelOffre = jest.fn(
  //           () =>
  //             ({
  //               type,
  //               cahiersDesChargesModifiésDisponibles: [
  //                 {
  //                   type: 'modifié',
  //                   paruLe: '30/08/2022',
  //                   délaiApplicable: {
  //                     délaiEnMois: 18,
  //                     intervaleDateMiseEnService: {
  //                       min: new Date('2022-09-01'),
  //                       max: new Date('2024-12-31'),
  //                     },
  //                   },
  //                 } as CahierDesChargesModifié,
  //               ] as ReadonlyArray<CahierDesChargesModifié>,
  //             } as ProjectAppelOffre),
  //         );
  //         it(`Etant donné un projet PV ${type} dont la date de mise en service est supérieure au 31 décembre 2024
  //     alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //           const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //             projectRepo,
  //             publishToEventStore,
  //             getProjectAppelOffre,
  //           });

  //           const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //             payload: {
  //               projetId: fakeProject.id.toString(),
  //               dateMiseEnService: new Date('31/12/2025'),
  //             } as DonnéesDeRaccordementRenseignéesdPayload,
  //           });

  //           await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //           expect(publishToEventStore).not.toHaveBeenCalled();
  //         });

  //         it(`Etant donné un projet PV ${type} dont la date de mise en service est inférieure au 1er septembre 2022,
  //     alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //           const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //             projectRepo,
  //             publishToEventStore,
  //             getProjectAppelOffre,
  //           });

  //           const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //             payload: {
  //               projetId: fakeProject.id.toString(),
  //               dateMiseEnService: new Date('01/08/2022'),
  //             } as DonnéesDeRaccordementRenseignéesdPayload,
  //           });

  //           await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //           expect(publishToEventStore).not.toHaveBeenCalled();
  //         });
  //       }
  //     });
  //     describe(`Projets éolien`, () => {
  //       const getProjectAppelOffre = jest.fn(
  //         () =>
  //           ({
  //             type: 'eolien',
  //             cahiersDesChargesModifiésDisponibles: [
  //               {
  //                 type: 'modifié',
  //                 paruLe: '30/08/2022',
  //                 délaiApplicable: {
  //                   délaiEnMois: 18,
  //                   intervaleDateMiseEnService: {
  //                     min: new Date('2022-06-01'),
  //                     max: new Date('2024-09-30'),
  //                   },
  //                 },
  //               } as CahierDesChargesModifié,
  //             ] as ReadonlyArray<CahierDesChargesModifié>,
  //           } as ProjectAppelOffre),
  //       );
  //       it(`Etant donné un projet éolien dont la date de mise en service est antérieure au 1er juin 2022
  //     alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //         const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //           projectRepo,
  //           publishToEventStore,
  //           getProjectAppelOffre,
  //         });

  //         const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //           payload: {
  //             projetId: fakeProject.id.toString(),
  //             dateMiseEnService: new Date('01/05/2022'),
  //           } as DonnéesDeRaccordementRenseignéesdPayload,
  //         });

  //         await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //         expect(publishToEventStore).not.toHaveBeenCalled();
  //       });

  //       it(`Etant donné un projet éolien dont la date de mise en service est postérieure au 30 septembre 2024
  //     alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //         const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //           projectRepo,
  //           publishToEventStore,
  //           getProjectAppelOffre,
  //         });

  //         const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //           payload: {
  //             projetId: fakeProject.id.toString(),
  //             dateMiseEnService: new Date('30/10/2024'),
  //           } as DonnéesDeRaccordementRenseignéesdPayload,
  //         });

  //         await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //         expect(publishToEventStore).not.toHaveBeenCalled();
  //       });
  //     });
  //   });

  //   describe(`Cahier des charges 2022 non souscrit`, () => {
  //     it(`Etant donné un projet éolien
  //        dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
  //        MAIS qui n'a pas souscrit au CDC 2022,
  //        alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //       const getProjectAppelOffre = jest.fn(
  //         () =>
  //           ({
  //             type: 'eolien',
  //             cahiersDesChargesModifiésDisponibles: [
  //               {
  //                 type: 'modifié',
  //                 paruLe: '30/08/2022',
  //                 délaiApplicable: {
  //                   délaiEnMois: 18,
  //                   intervaleDateMiseEnService: {
  //                     min: new Date('2022-06-01'),
  //                     max: new Date('2024-09-30'),
  //                   },
  //                 },
  //               } as CahierDesChargesModifié,
  //             ] as ReadonlyArray<CahierDesChargesModifié>,
  //           } as ProjectAppelOffre),
  //       );
  //       const fakeProject = {
  //         ...makeFakeProject(),
  //         cahierDesCharges: { type: 'modifié', paruLe: '30/07/2022' },
  //       };
  //       const projectRepo = fakeTransactionalRepo(fakeProject as Project);
  //       const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //         projectRepo,
  //         publishToEventStore,
  //         getProjectAppelOffre,
  //       });
  //       const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //         payload: {
  //           projetId: fakeProject.id.toString(),
  //           dateMiseEnService: new Date('01/01/2023'),
  //         } as DonnéesDeRaccordementRenseignéesdPayload,
  //       });
  //       await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //       expect(publishToEventStore).not.toHaveBeenCalled();
  //     });
  //   });

  //   describe(`Délai déjà appliqué`, () => {
  //     it(`Etant donné un projet éolien
  //        dont la date de mise en service est comprise entre le 1er juin 2022 et le 30 septembre 2024,
  //        qui a souscrit au CDC 2022,
  //        MAIS qui a déjà bénéficié du délai de 18 mois,
  //        alors le projet ne doit pas être modifié et aucun événement n'est émis`, async () => {
  //       const getProjectAppelOffre = jest.fn(
  //         () =>
  //           ({
  //             type: 'eolien',
  //             cahiersDesChargesModifiésDisponibles: [
  //               {
  //                 type: 'modifié',
  //                 paruLe: '30/08/2022',
  //                 délaiApplicable: {
  //                   délaiEnMois: 18,
  //                   intervaleDateMiseEnService: {
  //                     min: new Date('2022-06-01'),
  //                     max: new Date('2024-09-30'),
  //                   },
  //                 },
  //               } as CahierDesChargesModifié,
  //             ] as ReadonlyArray<CahierDesChargesModifié>,
  //           } as ProjectAppelOffre),
  //       );
  //       const fakeProject = {
  //         ...makeFakeProject(),
  //         cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
  //         délaiCDC2022appliqué: true,
  //       };
  //       const projectRepo = fakeTransactionalRepo(fakeProject as Project);
  //       const onDonnéesDeRaccordementRenseignées = makeOnDateMiseEnServiceTransmise({
  //         projectRepo,
  //         publishToEventStore,
  //         getProjectAppelOffre,
  //       });
  //       const événementMeSRenseignée = new DonnéesDeRaccordementRenseignées({
  //         payload: {
  //           projetId: fakeProject.id.toString(),
  //           dateMiseEnService: new Date('01/01/2023'),
  //         } as DonnéesDeRaccordementRenseignéesdPayload,
  //       });
  //       await onDonnéesDeRaccordementRenseignées(événementMeSRenseignée);
  //       expect(publishToEventStore).not.toHaveBeenCalled();
  //     });
  //   });
  // });
});
