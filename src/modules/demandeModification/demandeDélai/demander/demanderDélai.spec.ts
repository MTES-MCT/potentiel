import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { Project } from '../../../project';
import { Repository } from '../../../../core/domain';
import { okAsync } from '../../../../core/utils';
import { FileObject } from '../../../file';
import { EntityNotFoundError, InfraNotAvailableError, UnauthorizedError } from '../../../shared';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { makeDemanderDélai } from './demanderDelai';
import { AppelOffreRepo } from '../../../../dataAccess/inMemory';
import { fakeRepo } from '../../../../__tests__/fixtures/aggregates';
import makeFakeProject from '../../../../__tests__/fixtures/project';

import {
  DemanderDateAchèvementAntérieureDateThéoriqueError,
  NouveauCahierDesChargesNonChoisiError,
} from '.';
import { AppelOffre } from '../../../../entities';

describe('Commande demanderDélai', () => {
  const user = makeFakeUser({ role: 'porteur-projet' });

  const getProjectAppelOffreId = jest.fn(() =>
    okAsync<string, EntityNotFoundError | InfraNotAvailableError>('appelOffreId'),
  );
  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      choisirNouveauCahierDesCharges: true,
      periodes: [{ id: 'periodeId', type: 'notified' }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre);

  const fakeProject = makeFakeProject();

  const fileRepo = {
    save: jest.fn<Repository<FileObject>['save']>(() => okAsync(null)),
    load: jest.fn<Repository<FileObject>['load']>(),
  };

  const fakeFileContents = {
    filename: 'fakeFile.pdf',
    contents: Readable.from('test-content'),
  };

  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));

  const projectRepo = fakeRepo({
    ...fakeProject,
    cahierDesCharges: { paruLe: '30/07/2021' },
  } as Project);

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  const dateAchèvementDemandée = new Date('2022-01-01');

  describe(`Demande de délai impossible si le porteur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un porteur n'ayant pas les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => false);
      it(`Lorsque le porteur fait une demande de délai,
      alors, une erreur est retournée`, async () => {
        const demandeDelai = makeDemanderDélai({
          fileRepo,
          findAppelOffreById,
          publishToEventStore,
          shouldUserAccessProject,
          getProjectAppelOffreId,
          projectRepo,
        });

        const requestResult = await demandeDelai({
          justification: 'justification',
          dateAchèvementDemandée,
          file: fakeFileContents,
          user,
          projectId: fakeProject.id.toString(),
        });

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId: fakeProject.id.toString(),
        });

        expect(fileRepo.save).not.toHaveBeenCalled();
        expect(requestResult.isErr()).toEqual(true);
        if (requestResult.isOk()) return;
        expect(requestResult.error).toBeInstanceOf(UnauthorizedError);
      });
    });
  });

  describe(`Demande de délai impossible si la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement`, () => {
    const shouldUserAccessProject = jest.fn(async () => true);
    const projectRepo = fakeRepo(
      makeFakeProject({
        completionDueOn: new Date('2022-01-01').getTime(),
        cahierDesCharges: { paruLe: '30/07/2021' },
      }),
    );
    const demandeDelai = makeDemanderDélai({
      fileRepo,
      findAppelOffreById,
      publishToEventStore,
      shouldUserAccessProject,
      getProjectAppelOffreId,
      projectRepo,
    });

    it(`Lorsque la date limite d'achèvement souhaitée est antérieure à la date théorique d'achèvement, alors une erreur est retournée`, async () => {
      const resultat = await demandeDelai({
        justification: 'justification',
        dateAchèvementDemandée,
        file: fakeFileContents,
        user,
        projectId: fakeProject.id.toString(),
      });

      expect(resultat.isErr()).toEqual(true);
      const erreurActuelle = resultat._unsafeUnwrapErr();
      expect(erreurActuelle).toBeInstanceOf(DemanderDateAchèvementAntérieureDateThéoriqueError);
      expect(publishToEventStore).not.toHaveBeenCalled();
      expect(fileRepo.save).not.toHaveBeenCalled();
    });

    it(`Lorsque la date limite d'achèvement souhaitée est égale à la date théorique d'achèvement, alors une erreur est retournée`, async () => {
      const resultat = await demandeDelai({
        justification: 'justification',
        dateAchèvementDemandée,
        file: fakeFileContents,
        user,
        projectId: fakeProject.id.toString(),
      });

      expect(resultat.isErr()).toEqual(true);
      const erreurActuelle = resultat._unsafeUnwrapErr();
      expect(erreurActuelle).toBeInstanceOf(DemanderDateAchèvementAntérieureDateThéoriqueError);
      expect(publishToEventStore).not.toHaveBeenCalled();
      expect(fileRepo.save).not.toHaveBeenCalled();
    });
  });

  describe(`Demande de délai possible si le porteur a les droits sur le projet`, () => {
    describe(`Etant donné un porteur ayant les droits sur le projet`, () => {
      const shouldUserAccessProject = jest.fn(async () => true);
      describe(`Enregistrer la demande de délai`, () => {
        describe(`Lorsque le porteur fait une demande de délai`, () => {
          it(`Alors un événement DélaiDemandé devrait être émis`, async () => {
            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
              projectRepo,
            });

            await demandeDelai({
              justification: 'justification',
              dateAchèvementDemandée,
              user,
              projectId: fakeProject.id.toString(),
            });

            expect(publishToEventStore).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                type: 'DélaiDemandé',
                payload: expect.objectContaining({
                  dateAchèvementDemandée,
                  projetId: fakeProject.id.toString(),
                  cahierDesCharges: '30/07/2021',
                }),
              }),
            );
          });
        });
      });
      describe(`Enregistrer le fichier joint à la demande`, () => {
        describe(`Lorsque le porteur fait une demande de délai avec fichier joint`, () => {
          it(`Alors le fichier doit être enregistré`, async () => {
            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
              projectRepo,
            });

            await demandeDelai({
              justification: 'justification',
              dateAchèvementDemandée,
              user,
              projectId: fakeProject.id.toString(),
              file: fakeFileContents,
            });

            expect(fileRepo.save).toHaveBeenCalledWith(
              expect.objectContaining({ contents: fakeFileContents.contents }),
            );
          });
        });
      });

      describe(`Erreur si le porteur n'a pas souscri à un CDC modifié alors que l'AO le requiert`, () => {
        describe(`Étant donné un projet avec un AO requérant le choix d'un CDC modifié pour pouvoir effectuer des modifications sur Potentiel,
                  Lorsque le porteur fait une demande de délai,
                  et qu'il n'a pas encore souscri au nouveau cahier des charges`, () => {
          it(`Alors une erreur NouveauCahierDesChargesNonChoisiError devrait être retournée`, async () => {
            const projectRepo = fakeRepo({
              ...fakeProject,
              cahierDesCharges: { type: 'initial' },
            } as Project);

            const demandeDelai = makeDemanderDélai({
              fileRepo: fileRepo as Repository<FileObject>,
              findAppelOffreById,
              publishToEventStore,
              shouldUserAccessProject,
              getProjectAppelOffreId,
              projectRepo,
            });

            const res = await demandeDelai({
              justification: 'justification',
              dateAchèvementDemandée,
              user,
              projectId: fakeProject.id.toString(),
            });

            expect(res.isErr()).toEqual(true);
            if (res.isOk()) return;
            expect(res.error).toBeInstanceOf(NouveauCahierDesChargesNonChoisiError);
          });
        });
      });

      describe(`Appliquer la bonne autorité compétente selon l'appel d'offre`, () => {
        it(`Etant donné un projet de l'appel d'offre "CRE4 - Eolien" (id: "Eolien"), 
              lorsqu'une demande de délai est faite,
              alors l'autorité compétente devrait être la "dgec"`, async () => {
          const getProjectAppelOffreId = jest.fn(() =>
            okAsync<string, EntityNotFoundError | InfraNotAvailableError>('Eolien'),
          );

          const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
            ({
              id: 'Eolien',
              autoritéCompétenteDemandesDélai: 'dgec',
              choisirNouveauCahierDesCharges: true,
              periodes: [{ id: 'periodeId', type: 'notified' }],
              familles: [{ id: 'familleId' }],
            } as AppelOffre);

          const demandeDelai = makeDemanderDélai({
            fileRepo: fileRepo as Repository<FileObject>,
            findAppelOffreById,
            publishToEventStore,
            shouldUserAccessProject: jest.fn(async () => true),
            getProjectAppelOffreId,
            projectRepo,
          });

          await demandeDelai({
            justification: 'justification',
            dateAchèvementDemandée,
            user,
            projectId: fakeProject.id.toString(),
          });

          expect(publishToEventStore).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'DélaiDemandé',
              payload: expect.objectContaining({
                autorité: 'dgec',
              }),
            }),
          );
        });

        it(`Etant donné un projet d'un appel d'offre autre que "CRE4 - Eolien", 
              lorsqu'une demande de délai est faite,
              alors l'autorité compétente devrait être la "dreal"`, async () => {
          const getProjectAppelOffreId = jest.fn(() =>
            okAsync<string, EntityNotFoundError | InfraNotAvailableError>('autre AO'),
          );

          const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
            ({
              id: 'autre AO',
              choisirNouveauCahierDesCharges: true,
              periodes: [{ id: 'periodeId', type: 'notified' }],
              familles: [{ id: 'familleId' }],
            } as AppelOffre);

          const demandeDelai = makeDemanderDélai({
            fileRepo: fileRepo as Repository<FileObject>,
            findAppelOffreById,
            publishToEventStore,
            shouldUserAccessProject: jest.fn(async () => true),
            getProjectAppelOffreId,
            projectRepo,
          });

          await demandeDelai({
            justification: 'justification',
            dateAchèvementDemandée,
            user,
            projectId: fakeProject.id.toString(),
          });

          expect(publishToEventStore).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
              type: 'DélaiDemandé',
              payload: expect.objectContaining({
                autorité: 'dreal',
              }),
            }),
          );
        });
      });
    });
  });
});
