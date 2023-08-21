import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Project } from '../../../project';
import { okAsync } from '../../../../core/utils';
import { InfraNotAvailableError, UnauthorizedError } from '../../../shared';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import makeFakeProject from '../../../../__tests__/fixtures/project';

import { fakeRepo } from '../../../../__tests__/fixtures/aggregates';
import { makeDemanderAnnulationAbandon } from './demanderAnnulationAbandon';
import { ProjetNonAbandonnéError } from './ProjetNonAbandonnéError';
import { CDCIncompatibleAvecAnnulationAbandonError } from './CDCIncompatibleAvecAnnulationAbandonError';
import { ProjectAppelOffre } from '../../../../entities';
import { CahierDesChargesModifié } from '@potentiel/domain-views';

describe(`Demander une annulation d'abandon`, () => {
  const user = makeFakeUser({ role: 'porteur-projet' });

  const fakeProject = makeFakeProject({
    cahierDesCharges: {
      type: 'modifié',
      paruLe: '30/08/2022',
    },
  });

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));
  const getProjectAppelOffre = () =>
    ({
      cahiersDesChargesModifiésDisponibles: [
        {
          type: 'modifié',
          paruLe: '30/08/2022',
          délaiAnnulationAbandon: new Date(),
        } as CahierDesChargesModifié,
      ] as Readonly<Array<CahierDesChargesModifié>>,
    } as ProjectAppelOffre);

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  describe(`Demande impossible si le porteur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un porteur n'ayant pas les droits sur le projet
          Lorsque le porteur fait une demande d'annulation d'abandon,
          Alors le porteur est informé qu'il n'a pas l'accès à ce projet`, async () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
      } as Project);

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        publishToEventStore,
        shouldUserAccessProject: async () => false,
        getProjectAppelOffre,
        projectRepo,
      });

      const demandeAnnulationAbandon = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      });

      expect(demandeAnnulationAbandon.isErr()).toEqual(true);
      demandeAnnulationAbandon.isErr() &&
        expect(demandeAnnulationAbandon.error).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe(`Demande impossible si le projet n'est pas abandonné`, () => {
    it(`Étant donné un porteur ayant les droits sur le projet
      Lorsqu'il fait une demande d'annulation d'abandon pour un projet non abandonné,
      Alors le porteur est informé que cette action est impossible`, async () => {
      const fakeProject = makeFakeProject();
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
        abandonedOn: 0,
      } as Project);

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        publishToEventStore,
        shouldUserAccessProject: jest.fn(async () => true),
        getProjectAppelOffre,
        projectRepo,
      });

      const demande = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      });

      expect(demande.isErr()).toEqual(true);
      demande.isErr() && expect(demande.error).toBeInstanceOf(ProjetNonAbandonnéError);
    });
  });

  describe(`Demande impossible si le CDC du projet n'autorise pas l'annulation d'un abandon`, () => {
    it(`Etant donné un porteur ayant accès au projet,
      lorsqu'il fait une demande d'annulation d'abandon pour un projet dont le CDC ne permet cette action,
      alors le porteur devrait être informé qu'il doit d'abord changer de CDC`, async () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        isClasse: true,
      } as Project);

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        publishToEventStore,
        shouldUserAccessProject: jest.fn(async () => true),
        getProjectAppelOffre: () =>
          ({
            cahiersDesChargesModifiésDisponibles: [
              {
                type: 'modifié',
                paruLe: '30/08/2022',
                délaiAnnulationAbandon: undefined,
              } as CahierDesChargesModifié,
            ] as Readonly<Array<CahierDesChargesModifié>>,
          } as ProjectAppelOffre),
        projectRepo,
      });

      const demande = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      });

      expect(demande.isErr()).toEqual(true);
      demande.isErr() &&
        expect(demande.error).toBeInstanceOf(CDCIncompatibleAvecAnnulationAbandonError);
    });
  });

  describe(`Demande possible`, () => {
    it(`Etant donné un porteur ayant accès à un projet abandonné,
      et ayant souscri à un CDC compatible avec une annulation d'abandon,
      alors une demande devrait être envoyée`, async () => {
      const projectRepo = fakeRepo({
        ...fakeProject,
        abandonedOn: 123,
      } as Project);

      const demanderAnnulationAbandon = makeDemanderAnnulationAbandon({
        publishToEventStore,
        shouldUserAccessProject: jest.fn(async () => true),
        getProjectAppelOffre,
        projectRepo,
      });

      const demande = await demanderAnnulationAbandon({
        user,
        projetId: fakeProject.id.toString(),
      });

      expect(demande.isOk()).toEqual(true);
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AnnulationAbandonDemandée',
          payload: {
            demandeId: expect.any(String),
            projetId: fakeProject.id.toString(),
            demandéPar: user.id,
            cahierDesCharges: '30/08/2022',
          },
        }),
      );
    });
  });
});
