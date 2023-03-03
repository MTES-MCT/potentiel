import models from '../../models';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeFile from '../../../../__tests__/fixtures/file';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { getModificationRequestDetails } from './getModificationRequestDetails';
import { UniqueEntityID } from '@core/domain';
import { ModificationRequest, Project, Raccordements, User } from '@infra/sequelize';

describe('Requête getModificationRequestDetails', () => {
  const projectId = new UniqueEntityID().toString();
  const fileId = new UniqueEntityID().toString();
  const modificationRequestId = new UniqueEntityID().toString();
  const userId = new UniqueEntityID().toString();
  const userId2 = new UniqueEntityID().toString();

  const projectInfo = {
    id: projectId,
    numeroCRE: 'numeroCRE',
    nomProjet: 'nomProjet',
    nomCandidat: 'nomCandidat',
    communeProjet: 'communeProjet',
    departementProjet: 'departementProjet',
    regionProjet: 'regionProjet',
    puissance: 123,
    notifiedOn: new Date(321).getTime(),
    appelOffreId: 'Fessenheim',
    periodeId: '1',
    familleId: 'familleId',
  };

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(makeFakeProject(projectInfo));
  });

  const versionDate = new Date(456);

  describe(`Données par type de demande attendues`, () => {
    it(`Etant donné une modification de type "recours",
      lorsqu'un utilisateur affiche le détail de la demande,
      alors la requête devrait retourner un DTO complet ModificationRequestPageDTO`, async () => {
      const FileModel = models.File;
      await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }));

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }));
      await User.create(makeFakeUser({ id: userId2, fullName: 'Admin Doe' }));

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      });

      const modificationRequestResult = await getModificationRequestDetails(
        modificationRequestId.toString(),
      );

      expect(modificationRequestResult.isOk()).toBe(true);
      if (modificationRequestResult.isErr()) return;

      const modificationRequestDTO = modificationRequestResult.value;

      expect(modificationRequestDTO).toMatchObject({
        id: modificationRequestId,
        type: 'recours',
        status: 'envoyée',
        respondedOn: 321,
        respondedBy: 'Admin Doe',
        versionDate: versionDate.getTime(),
        requestedOn: 123,
        requestedBy: 'John Doe',
        justification: 'justification',
        attachmentFile: {
          filename: 'filename',
          id: fileId,
        },
        project: {
          ...projectInfo,
          unitePuissance: 'MWc',
          notifiedOn: projectInfo.notifiedOn,
        },
      });
    });

    it(`Etant donné une modification de type "puissance",
      lorsqu'un utilisateur affiche le détail de la demande,
      alors la requête devrait retourner un DTO complet ModificationRequestPageDTO`, async () => {
      const FileModel = models.File;
      await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }));

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }));
      await User.create(makeFakeUser({ id: userId2, fullName: 'Admin Doe' }));

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'puissance',
        puissance: 175,
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      });

      const modificationRequestResult = await getModificationRequestDetails(
        modificationRequestId.toString(),
      );

      expect(modificationRequestResult.isOk()).toBe(true);
      if (modificationRequestResult.isErr()) return;

      const modificationRequestDTO = modificationRequestResult.value;

      expect(modificationRequestDTO).toMatchObject({
        id: modificationRequestId,
        type: 'puissance',
        puissance: 175,
        status: 'envoyée',
        respondedOn: 321,
        respondedBy: 'Admin Doe',
        versionDate: versionDate.getTime(),
        requestedOn: 123,
        requestedBy: 'John Doe',
        justification: 'justification',
        attachmentFile: {
          filename: 'filename',
          id: fileId,
        },
        project: {
          ...projectInfo,
          unitePuissance: 'MWc',
          notifiedOn: projectInfo.notifiedOn,
        },
      });
    });
  });

  describe(`Données de raccordement attendues`, () => {
    it(`Etant donné un projet ayant un identifiant de gestionnaire réseau,
      et une demande de modification, 
      lorsqu'un utilisateur affiche le détail de la demande,
      alors la requête devrait retourner l'identifiant de gestionnnaire réseau`, async () => {
      const identifiantGestionnaire = 'identifiant-du-gestionnaire';
      await Raccordements.create({
        id: new UniqueEntityID().toString(),
        projetId: projectId,
        identifiantGestionnaire,
      });

      const FileModel = models.File;
      await FileModel.create(makeFakeFile({ id: fileId, filename: 'filename' }));

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }));
      await User.create(makeFakeUser({ id: userId2, fullName: 'Admin Doe' }));

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      });

      const modificationRequestResult = await getModificationRequestDetails(
        modificationRequestId.toString(),
      );

      expect(modificationRequestResult.isOk()).toBe(true);
      if (modificationRequestResult.isErr()) return;

      const modificationRequestDTO = modificationRequestResult.value;

      expect(modificationRequestDTO.id).toEqual(modificationRequestId);
      expect(modificationRequestDTO.project.identifiantGestionnaire).toEqual(
        identifiantGestionnaire,
      );
    });
  });
});
