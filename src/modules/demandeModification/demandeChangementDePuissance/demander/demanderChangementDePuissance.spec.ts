import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { PuissanceJustificationEtCourrierManquantError } from './PuissanceJustificationEtCourrierManquantError';
import { DomainEvent, Repository } from '../../../../core/domain';
import { okAsync } from '../../../../core/utils';
import { ProjectAppelOffre, makeUser } from '../../../../entities';
import { UnwrapForTest } from '../../../../types';
import { fakeTransactionalRepo, makeFakeProject } from '../../../../__tests__/fixtures/aggregates';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { FileObject } from '../../../file';
import { Project } from '../../../project';
import { InfraNotAvailableError, UnauthorizedError } from '../../../shared';
import { ModificationReceived, ModificationRequested } from '../../../modificationRequest/events';
import { makeDemanderChangementDePuissance } from './demanderChangementDePuissance';
import { CahierDesChargesModifié } from '@potentiel-domain/appel-offre';
import { NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError } from './NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError';

describe('Commande requestPuissanceModification', () => {
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })));
  const fakeProject = {
    ...makeFakeProject(),
    puissanceInitiale: 100,
    cahierDesCharges: { type: 'initial' },
  };
  const projectRepo = fakeTransactionalRepo(fakeProject as Project);
  const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));
  const eventBus = {
    publish: fakePublish,
    subscribe: jest.fn(),
  };
  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  };
  const file = { contents: Readable.from('test-content'), filename: 'myfilename.pdf' };
  const getPuissanceProjet = jest.fn((projectId: string) => okAsync(123));

  const getProjectAppelOffre = jest.fn(
    () =>
      ({
        typeAppelOffre: 'eolien',
        changementPuissance: { ratios: { min: 0.8, max: 1.2 } },
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

  beforeEach(async () => {
    fakePublish.mockClear();
    fileRepo.save.mockClear();
  });

  describe(`Le porteur n'a pas les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => false);
    const requestPuissanceModification = makeDemanderChangementDePuissance({
      projectRepo,
      eventBus,
      getPuissanceProjet,
      shouldUserAccessProject,
      exceedsRatiosChangementPuissance: () => false,
      exceedsPuissanceMaxDuVolumeReserve: () => false,
      fileRepo: fileRepo as Repository<FileObject>,
      getProjectAppelOffre,
    });
    const newPuissance = 89;

    it(`Étant donné un projet
        Et un porteur n'ayant pas les droits sur le projet 
        Lorsque le porteur fait une demande de changement de puissance    
        Alors une erreur de type UnauthorizedError devrait être émise
        Et la demande ne devrait pas être envoyée`, async () => {
      fakePublish.mockClear();
      fileRepo.save.mockClear();

      const res = await requestPuissanceModification({
        projectId: fakeProject.id.toString(),
        requestedBy: fakeUser,
        newPuissance,
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
      expect(fakePublish).not.toHaveBeenCalled();
    });
  });

  describe(`Le porteur a les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => true);

    describe(`Demandes à instruire`, () => {
      describe(`Erreur à émettre si courrier ou justification manquant pour un CDC autre que 2022`, () => {
        describe(`Etant donné un projet dont le CDC applicable est le CDC initial`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance sans courrier ni justification,
        alors une erreur devrait être retournée et le changement ne devrait pas être enregistré`, async () => {
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
              getProjectAppelOffre,
            });

            const newPuissance = 89;

            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance,
            });

            expect(res.isErr()).toBe(true);
            if (res.isOk()) return;
            expect(res.error).toBeInstanceOf(PuissanceJustificationEtCourrierManquantError);
          });
        });
      });

      describe(`Explication et fichier manquants pour une demande hors ratio pour un projet ayant le CDC 2022`, () => {
        describe(`Etant donné un projet dont le CDC applicable est celui du 30/08/22`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance hors ratio sans courrier ni justification,
        alors une erreur devrait être retournée et le changement ne devrait pas être enregistré`, async () => {
            const fakeProject = {
              ...makeFakeProject(),
              puissanceInitiale: 100,
              cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
            };
            const projectRepo = fakeTransactionalRepo(fakeProject as Project);
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
              getProjectAppelOffre,
            });

            const newPuissance = 160;

            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance,
            });

            expect(res.isErr()).toBe(true);
            if (res.isOk()) return;
            expect(res.error).toBeInstanceOf(PuissanceJustificationEtCourrierManquantError);

            expect(eventBus.publish).not.toHaveBeenCalled();
          });
        });
      });

      describe(`Demande avec courrier et justificatif pour projet soumis au CDC 2021`, () => {
        describe(`Etant donné un projet dont le CDC applicable est le CDC 2021`, () => {
          it(`Lorsque le porteur fait une demande de changement puissance avec courrier et justification,
        alors la demande devrait être envoyée,
        le fichier devrait être enregistré
        et le projet ne devrait pas être modifié`, async () => {
            const requestPuissanceModification = makeDemanderChangementDePuissance({
              projectRepo,
              eventBus,
              getPuissanceProjet,
              shouldUserAccessProject,
              exceedsRatiosChangementPuissance: () => true,
              exceedsPuissanceMaxDuVolumeReserve: () => false,
              fileRepo: fileRepo as Repository<FileObject>,
              getProjectAppelOffre,
            });
            const res = await requestPuissanceModification({
              projectId: fakeProject.id.toString(),
              requestedBy: fakeUser,
              newPuissance: 90,
              fichier: file,
              justification: 'test',
            });

            expect(res.isOk()).toBe(true);

            expect(shouldUserAccessProject).toHaveBeenCalledWith({
              user: fakeUser,
              projectId: fakeProject.id.toString(),
            });

            expect(eventBus.publish).toHaveBeenCalledTimes(1);
            const event = eventBus.publish.mock.calls[0][0];
            expect(event).toBeInstanceOf(ModificationRequested);

            expect(event).toMatchObject({
              payload: {
                type: 'puissance',
                puissance: 90,
                puissanceAuMomentDuDepot: 123,
                cahierDesCharges: 'initial',
              },
            });

            expect(fakeProject.pendingEvents).toHaveLength(0);

            expect(fileRepo.save).toHaveBeenCalledTimes(1);
            expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents);
            expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename);
          });
        });
      });
    });

    describe('Informations enregistrées', () => {
      it(`Lorsqu'une demande de changement de puissance qui ne sort pas des ratios de l'AO est faite
          Alors la demande devrait être en statut "informations enregistrées"
          Et le fichier devrait être sauvegardé
          Et le projet devrait être modifié avec la nouvelle puissance
         `, async () => {
        const requestPuissanceModification = makeDemanderChangementDePuissance({
          projectRepo,
          eventBus,
          getPuissanceProjet,
          shouldUserAccessProject,
          exceedsRatiosChangementPuissance: () => false,
          exceedsPuissanceMaxDuVolumeReserve: () => false,
          fileRepo: fileRepo as Repository<FileObject>,
          getProjectAppelOffre,
        });
        const newPuissance = 105;

        const res = await requestPuissanceModification({
          projectId: fakeProject.id.toString(),
          requestedBy: fakeUser,
          newPuissance,
          fichier: file,
        });

        expect(res.isOk()).toBe(true);

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        });

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationReceived);
        expect(event).toMatchObject({
          payload: {
            type: 'puissance',
            puissance: newPuissance,
            puissanceAuMomentDuDepot: 123,
            cahierDesCharges: 'initial',
          },
        });

        expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, newPuissance);

        expect(fileRepo.save).toHaveBeenCalledTimes(1);
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents);
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename);
      });

      it(`Étant donné un projet avec le cahier des charges 2022
          Lorsqu'une demande de changement de puissance est faite pour une nouvelle valeur entre la puissance max du CDC initial et la puissance max du CDC 2022
          Alors la demande devrait être en statut "informations enregistrées"
          Et le fichier devrait être sauvegardé
          Et le projet devrait être modifié avec la nouvelle puissance
         `, async () => {
        const fakeProject = {
          ...makeFakeProject(),
          puissanceInitiale: 100,
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const getProjectAppelOffre = jest.fn(
          () =>
            ({
              typeAppelOffre: 'eolien',
              changementPuissance: { ratios: { min: 0.8, max: 1.2 } },
              periode: {
                cahiersDesChargesModifiésDisponibles: [
                  {
                    type: 'modifié',
                    paruLe: '30/08/2022',
                    seuilSupplémentaireChangementPuissance: {
                      ratios: {
                        min: 0.9,
                        max: 1.4,
                      },
                    },
                  } as CahierDesChargesModifié,
                ] as ReadonlyArray<CahierDesChargesModifié>,
              },
            } as ProjectAppelOffre),
        );

        const requestPuissanceModification = makeDemanderChangementDePuissance({
          projectRepo,
          eventBus,
          getPuissanceProjet: jest.fn((projectId: string) => okAsync(123)),
          shouldUserAccessProject,
          exceedsRatiosChangementPuissance: () => false,
          exceedsPuissanceMaxDuVolumeReserve: () => false,
          fileRepo: fileRepo as Repository<FileObject>,
          getProjectAppelOffre,
        });
        const newPuissance = 135;

        const res = await requestPuissanceModification({
          projectId: fakeProject.id.toString(),
          requestedBy: fakeUser,
          newPuissance,
          fichier: file,
        });

        expect(res.isOk()).toBe(true);

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user: fakeUser,
          projectId: fakeProject.id.toString(),
        });

        expect(eventBus.publish).toHaveBeenCalledTimes(1);
        const event = eventBus.publish.mock.calls[0][0];
        expect(event).toBeInstanceOf(ModificationReceived);
        expect(event).toMatchObject({
          payload: {
            type: 'puissance',
            puissance: newPuissance,
            puissanceAuMomentDuDepot: 123,
            cahierDesCharges: '30/08/2022',
          },
        });

        expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, newPuissance);

        expect(fileRepo.save).toHaveBeenCalledTimes(1);
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(file.contents);
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(file.filename);
      });
    });

    describe(`Cas d'une nouvelle puissance dépassant la puissance max du volume réservé`, () => {
      it(`Étant donné un projet notifié dans un volume réservé
          Lorsque le porteur demande un changement de puissance au dessus de la puissance max du volume réservé
          Alors une erreur devrait être retournée et le changement ne devrait pas être enregistré`, async () => {
        const requestPuissanceModification = makeDemanderChangementDePuissance({
          projectRepo,
          eventBus,
          getPuissanceProjet,
          shouldUserAccessProject,
          exceedsRatiosChangementPuissance: () => false,
          exceedsPuissanceMaxDuVolumeReserve: () => true,
          fileRepo: fileRepo as Repository<FileObject>,
          getProjectAppelOffre,
        });

        const newPuissance = 89;

        const res = await requestPuissanceModification({
          projectId: fakeProject.id.toString(),
          requestedBy: fakeUser,
          newPuissance,
        });

        expect(res.isErr()).toBe(true);
        if (res.isOk()) return;
        expect(res.error).toBeInstanceOf(NouvellePuissanceAuDessusPuissanceMaxVolumeReserveError);
      });
    });
  });
});
