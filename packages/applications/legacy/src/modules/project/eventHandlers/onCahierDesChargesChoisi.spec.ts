import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CahierDesChargesChoisi } from '../events';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { InfraNotAvailableError } from '../../shared/errors';
import { okAsync } from '../../../core/utils';
import { CahierDesChargesModifié } from '@potentiel-domain/appel-offre';
import { ProjectAppelOffre } from '../../../entities';
import {
  fakeTransactionalRepo,
  makeFakeProject as makeFakeProjectAggregate,
} from '../../../__tests__/fixtures/aggregates';
import { makeOnCahierDesChargesChoisi } from './onCahierDesChargesChoisi';
import { Project } from '../Project';
import { RécupérerDétailDossiersRaccordements } from '../queries';
import { DateTime } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/laureat';

describe(`onCahierDesChargesChoisi event handler`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

  const récupérerDétailDossiersRaccordements = jest.fn<RécupérerDétailDossiersRaccordements>(
    async () => [
      {
        référence: Raccordement.RéférenceDossierRaccordement.convertirEnValueType('ref-du-dossier'),
        demandeComplèteRaccordement: {
          dateQualification: DateTime.convertirEnValueType(new Date('2022-01-01').toISOString()),
        },
        miseEnService: {
          dateMiseEnService: DateTime.convertirEnValueType(new Date('2023-01-01').toISOString()),
        },
        misÀJourLe: DateTime.now(),
      },
    ],
  );

  beforeEach(async () => {
    publishToEventStore.mockClear();
  });

  describe(`Retirer le délai relatif au CDC 2022`, () => {
    it(`
    Etant donné un projet sur le CDC du 30/08/2022
    Et ayant bénéficié du délai relatif au CDC du 30/08/2022
    Lorsque le porteur change de cahier des charges
    Alors le délai relatif au CDC du 30/08/2022 devrait être annulé
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');
      const nouvelleDateAchèvementAttendue = new Date(
        new Date(dateAchèvementInitiale).setMonth(
          new Date(dateAchèvementInitiale).getMonth() - CDCDélaiApplicable,
        ),
      );

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: true,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: { choisiPar: 'id', type: 'initial', projetId: projetId.toString() },
        }),
      );

      expect(publishToEventStore).toHaveBeenCalledTimes(1);
      const évènement = publishToEventStore.mock.calls[0][0];
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet');
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'ChoixCDCAnnuleDélaiCdc2022',
        }),
      );
    });
  });

  describe(`Ajouter le délai relatif au CDC 2022`, () => {
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période prévoit un délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Et ayant ses dates de mise en service dans l'intervalle accepté pour l'application du délai
    Lorsque le porteur choisit le CDC du 30/08/2022
    Alors la date d'achèvement du projet devrait être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');
      const nouvelleDateAchèvementAttendue = new Date(
        new Date(dateAchèvementInitiale).setMonth(
          new Date(dateAchèvementInitiale).getMonth() + CDCDélaiApplicable,
        ),
      );

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/08/2022',
            projetId: projetId.toString(),
          },
        }),
      );

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

  describe(`Pas d'effet`, () => {
    it(`
    Etant donné un projet sur le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Lorsque le porteur change de cahier des charges
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: { choisiPar: 'id', type: 'initial', projetId: projetId.toString() },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });

    // La période ne prévoit pas un délai supplémentaire
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période ne prévoit pas de délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Et ayant ses dates de mise en service dans l'intervalle accepté pour l'application du délai
    Lorsque le porteur choisit le CDC du 30/08/2022
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const getProjectAppelOffre = jest.fn(
        () =>
          ({
            typeAppelOffre: 'eolien',
            periode: {
              cahiersDesChargesModifiésDisponibles: [
                {
                  type: 'modifié',
                  paruLe: '30/08/2022',
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/08/2022',
            projetId: projetId.toString(),
          },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });

    // le projet a déjà bénéficié du délai
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période prévoit un délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et ayant déjà bénéficié du délai relatif au CDC du 30/08/2022
    Et ayant ses dates de mise en service dans l'intervalle accepté pour l'application du délai
    Lorsque le porteur choisit le CDC du 30/08/2022
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: true,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/08/2022',
            projetId: projetId.toString(),
          },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });

    // Le projet n'a pas toutes ses dates de mises en service renseignées
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période prévoit un délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Et n'ayant pas toutes ses dates de mise en service renseignées
    Lorsque le porteur choisit le CDC du 30/08/2022
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const récupérerDétailDossiersRaccordements = jest.fn<RécupérerDétailDossiersRaccordements>(
        async () => [
          {
            référence:
              Raccordement.RéférenceDossierRaccordement.convertirEnValueType('ref-du-dossier'),
            demandeComplèteRaccordement: {
              dateQualification: DateTime.convertirEnValueType(
                new Date('2022-01-01').toISOString(),
              ),
              miseEnService: {
                dateMiseEnService: DateTime.convertirEnValueType(
                  new Date('2023-01-01').toISOString(),
                ),
              },
            },
            misÀJourLe: DateTime.now(),
          },
          {
            référence:
              Raccordement.RéférenceDossierRaccordement.convertirEnValueType('ref-autre-dossier'),
            demandeComplèteRaccordement: {
              dateQualification: DateTime.convertirEnValueType(
                new Date('2022-01-01').toISOString(),
              ),
            },
            misÀJourLe: DateTime.now(),
          },
        ],
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/08/2022',
            projetId: projetId.toString(),
          },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });

    // le projet n'a pas toutes ses dates de mise en service dans l'intervalle pour le délai
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période prévoit un délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Et n'ayant pas toutes ses dates de mise en service dans l'intervalle accepté pour l'application du délai
    Lorsque le porteur choisit le CDC du 30/08/2022
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const dateMiseEnServiceHorsIntervalle = new Date('2022-01-01');

      const récupérerDétailDossiersRaccordements = jest.fn<RécupérerDétailDossiersRaccordements>(
        async () => [
          {
            référence:
              Raccordement.RéférenceDossierRaccordement.convertirEnValueType('ref-du-dossier'),
            demandeComplèteRaccordement: {
              dateQualification: DateTime.convertirEnValueType(
                new Date('2022-01-01').toISOString(),
              ),
              miseEnService: {
                dateMiseEnService: DateTime.convertirEnValueType(
                  dateMiseEnServiceHorsIntervalle.toISOString(),
                ),
              },
            },
            misÀJourLe: DateTime.now(),
          },
          {
            référence:
              Raccordement.RéférenceDossierRaccordement.convertirEnValueType('ref-autre-dossier'),
            demandeComplèteRaccordement: {
              dateQualification: DateTime.convertirEnValueType(
                new Date('2022-01-01').toISOString(),
              ),
              miseEnService: {
                dateMiseEnService: DateTime.convertirEnValueType(
                  dateMiseEnServiceHorsIntervalle.toISOString(),
                ),
              },
            },
            misÀJourLe: DateTime.now(),
          },
        ],
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/08/2022',
            projetId: projetId.toString(),
          },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });

    // le porteur choisit un CDC autre que le CDC du 30/08/2022
    it(`
    Etant donné un projet sur le CDC initial
    Et dont la période prévoit un délai de 18 mois supplémentaire pour le CDC du 30/08/2022
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Et ayant ses dates de mise en service dans l'intervalle accepté pour l'application du délai
    Lorsque le porteur choisit le CDC 2021
    Alors la date d'achèvement du projet ne devrait pas être modifiée
    `, async () => {
      const projetId = new UniqueEntityID();
      const appelOffreId = 'Eolien';
      const periodeId = '1';
      const numeroCRE = '123';
      const familleId = '';
      const CDCDélaiApplicable = 18;
      const dateAchèvementInitiale = new Date('2025-01-01');

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'initial' },
        completionDueOn: dateAchèvementInitiale.getTime(),
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };

      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

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
                    délaiEnMois: CDCDélaiApplicable,
                    intervaleDateMiseEnService: {
                      min: new Date('2022-06-01').toISOString(),
                      max: new Date('2024-09-30').toISOString(),
                    },
                  },
                } as CahierDesChargesModifié,
              ] as ReadonlyArray<CahierDesChargesModifié>,
            },
          } as ProjectAppelOffre),
      );

      const onCahierDesChargesChoisi = makeOnCahierDesChargesChoisi({
        publishToEventStore,
        getProjectAppelOffre,
        projectRepo,
        récupérerDétailDossiersRaccordements,
      });

      await onCahierDesChargesChoisi(
        new CahierDesChargesChoisi({
          payload: {
            choisiPar: 'id',
            type: 'modifié',
            paruLe: '30/07/2021',
            projetId: projetId.toString(),
          },
        }),
      );

      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });
});
