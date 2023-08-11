import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { okAsync } from '@core/utils';
import { CahierDesChargesModifié, ProjectAppelOffre, User } from '@entities';
import { InfraNotAvailableError } from '@modules/shared';
import {
  DemandeAnnulationAbandon,
  statutsDemandeAnnulationAbandon,
} from '../DemandeAnnulationAbandon';
import { makeAccorderAnnulationAbandon } from './accorderAnnulationAbandon';
import { Project } from '@modules/project';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { fakeRepo, fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates';
import { StatutDemandeIncompatibleAvecAccordAnnulationAbandonError } from './StatutDemandeIncompatibleAvecAccordAnnulationAbandonError';
import { StatutProjetIncompatibleAvecAccordAnnulationAbandonError } from './StatutProjetIncompatibleAvecAccordAnnulationAbandonError';
import { CDCProjetIncompatibleAvecAccordAnnulationAbandonError } from './CDCProjetIncompatibleAvecAccordAnnulationAbandonError';
import { Readable } from 'stream';

describe(`Accorder une annulation d'abandon de projet`, () => {
  // commande
  const utilisateur = { role: 'admin' } as User;
  const demandeId = new UniqueEntityID().toString();
  const projet = makeFakeProject();
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  };

  // dépendances
  const projectRepo = fakeRepo({
    ...projet,
    isClasse: true,
    abandonedOn: 123,
    cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
  } as Project);

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));

  const demande = { statut: 'envoyée', projetId: projet.id } as DemandeAnnulationAbandon;

  const demandeAnnulationAbandonRepo = {
    ...fakeTransactionalRepo(demande),
    ...fakeRepo(demande),
  };

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

  const fileRepo = fakeRepo();

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  describe(`Cas d'une demande qui n'est pas en statut "envoyée"`, () => {
    for (const statut of statutsDemandeAnnulationAbandon.filter((statut) => statut !== 'envoyée')) {
      it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut ${statut},
        alors il devrait être notifié que l'action est impossible en raison du statut incompatible de la demande`, async () => {
        const demande = {
          statut: 'annulée',
          projetId: projet.id,
        } as DemandeAnnulationAbandon;

        const demandeAnnulationAbandonRepo = {
          ...fakeTransactionalRepo(demande),
          ...fakeRepo(demande),
        };

        const accorder = makeAccorderAnnulationAbandon({
          publishToEventStore,
          projectRepo,
          demandeAnnulationAbandonRepo,
          getProjectAppelOffre,
          fileRepo,
        });

        const accord = await accorder({ utilisateur, demandeId, fichierRéponse });

        expect(accord.isErr()).toEqual(true);
        accord.isErr() &&
          expect(accord.error).toBeInstanceOf(
            StatutDemandeIncompatibleAvecAccordAnnulationAbandonError,
          );
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    }
  });

  describe(`Cas d'un projet qui n'est pas abandonné`, () => {
    it(`Etant donné un projet non abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible car le projet n'est pas abandonné`, async () => {
      const projectRepo = fakeRepo({ ...projet, isClasse: true, abandonedOn: 0 } as Project);

      const accorder = makeAccorderAnnulationAbandon({
        publishToEventStore,
        projectRepo,
        demandeAnnulationAbandonRepo,
        getProjectAppelOffre,
        fileRepo,
      });

      const accord = await accorder({ utilisateur, demandeId, fichierRéponse });

      expect(accord.isErr()).toEqual(true);
      accord.isErr() &&
        expect(accord.error).toBeInstanceOf(
          StatutProjetIncompatibleAvecAccordAnnulationAbandonError,
        );
      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });

  describe(`Cas d'un CDC incompatible avec une annulation d'abandon`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        mais que le CDC actuel du projet ne prévoit pas d'annulation d'abandon,
        alors il devrait être notifié que l'action est impossible en raison du CDC incompatible`, async () => {
      const getProjectAppelOffre = () =>
        ({
          cahiersDesChargesModifiésDisponibles: [
            {
              type: 'modifié',
              paruLe: '30/08/2022',
              délaiAnnulationAbandon: undefined,
            } as CahierDesChargesModifié,
          ] as Readonly<Array<CahierDesChargesModifié>>,
        } as ProjectAppelOffre);

      const accorder = makeAccorderAnnulationAbandon({
        publishToEventStore,
        projectRepo,
        demandeAnnulationAbandonRepo,
        getProjectAppelOffre,
        fileRepo,
      });

      const accord = await accorder({ utilisateur, demandeId, fichierRéponse });

      expect(accord.isErr()).toEqual(true);
      accord.isErr() &&
        expect(accord.error).toBeInstanceOf(CDCProjetIncompatibleAvecAccordAnnulationAbandonError);
      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });

  describe(`Conditions d'acceptation réunies`, () => {
    it(`Etant donné un projet abandonné,
        lorsqu'un admin accepte une demande d'annulation d'abandon en statut "envoyée",
        et que le CDC actuel du projet prévoit l'annulation d'abandon,
        alors la demande devrait être accordée
        et le fichier sauvegardé`, async () => {
      const accorder = makeAccorderAnnulationAbandon({
        publishToEventStore,
        projectRepo,
        demandeAnnulationAbandonRepo,
        getProjectAppelOffre,
        fileRepo,
      });

      const accord = await accorder({ utilisateur, demandeId, fichierRéponse });

      expect(accord.isOk()).toBe(true);

      expect(fileRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          designation: 'modification-request-response',
          filename: fichierRéponse.filename,
          path: `projects/${projet.id}/fichier-réponse`,
          forProject: projet.id,
        }),
      );

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AnnulationAbandonAccordée',
          payload: {
            accordéPar: utilisateur.id,
            demandeId,
            projetId: projet.id,
            fichierRéponseId: expect.any(String),
          },
        }),
      );
    });
  });
});
