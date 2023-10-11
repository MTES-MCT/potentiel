import { jest, describe, it, expect } from '@jest/globals';
import { CahierDesChargesChoisi } from '../events';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { InfraNotAvailableError } from '../../shared/errors';
import { okAsync } from '../../../core/utils';
import { CahierDesChargesModifié } from '@potentiel/domain-views';
import { ProjectAppelOffre } from '../../../entities';
import {
  fakeTransactionalRepo,
  makeFakeProject as makeFakeProjectAggregate,
} from '../../../__tests__/fixtures/aggregates';
import { makeOnCahierDesChargesChoisi } from './onCahierDesChargesChoisi';
import { Project } from '../Project';

describe(`Retirer le délai relatif au CDC 2022`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

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
                    min: new Date('2022-06-01'),
                    max: new Date('2024-09-30'),
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
        reason: 'délaiCdc2022Annulé',
      }),
    );
  });
});

describe(`Pas d'effet`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

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
                    min: new Date('2022-06-01'),
                    max: new Date('2024-09-30'),
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
    });

    await onCahierDesChargesChoisi(
      new CahierDesChargesChoisi({
        payload: { choisiPar: 'id', type: 'initial', projetId: projetId.toString() },
      }),
    );

    expect(publishToEventStore).not.toHaveBeenCalled();
  });

  it(`
    Etant donné un projet sur le CDC initial
    Et n'ayant pas bénéficié du délai relatif au CDC du 30/08/2022
    Lorsque le porteur choisit le CDC du 20/08/2022
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
                    min: new Date('2022-06-01'),
                    max: new Date('2024-09-30'),
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
});
