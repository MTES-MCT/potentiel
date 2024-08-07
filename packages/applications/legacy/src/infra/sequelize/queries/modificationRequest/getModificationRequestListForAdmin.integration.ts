import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../helpers';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeFile from '../../../../__tests__/fixtures/file';
import { getModificationRequestListForAdmin } from './getModificationRequestListForAdmin';
import { UniqueEntityID } from '../../../../core/domain';
import { User as userEntity } from '../../../../entities';
import { ModificationRequest, Project, User, UserDreal, File } from '../../projectionsNext';

describe('Sequelize getModificationRequestListForAdmin', () => {
  const projectId = new UniqueEntityID().toString();
  const fileId = new UniqueEntityID().toString();

  describe('generally', () => {
    const modificationRequestId = new UniqueEntityID().toString();

    const projectInfo = {
      id: projectId,
      nomProjet: 'nomProjet',
      communeProjet: 'communeProjet',
      departementProjet: 'departementProjet',
      regionProjet: 'regionProjet',
      appelOffreId: 'Fessenheim',
      periodeId: '1',
      familleId: 'familleId',
    };

    const fakePorteur = _creerPorteurProjet();
    const fakeAdmin = _creerAdmin();

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await Project.create(makeFakeProject(projectInfo));

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }));

      await User.create(fakePorteur);
      await User.create(fakeAdmin);

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId: fakePorteur.id,
        fileId,
        type: 'recours',
        requestedOn: 123,
        status: 'envoyée',
        justification: 'justification',
        authority: 'dgec',
      });

      await ModificationRequest.create({
        id: new UniqueEntityID().toString(),
        projectId,
        userId: fakePorteur.id,
        fileId,
        type: 'producteur',
        requestedOn: 123,
        status: 'envoyée',
        justification: 'justification',
        authority: 'dgec',
        isLegacy: true, // should be ignored because of this
      });
    });

    it('should return a paginated list of all non-legacy modification requests', async () => {
      const res = await getModificationRequestListForAdmin({
        user: fakeAdmin,
        pagination: { page: 0, pageSize: 1 },
      });

      expect(res.isOk()).toBe(true);

      expect(res._unsafeUnwrap().itemCount).toEqual(1);
      expect(res._unsafeUnwrap().items[0]).toMatchObject({
        id: modificationRequestId,
        status: 'envoyée',
        requestedOn: 123,
        requestedBy: {
          email: fakePorteur.email,
          fullName: fakePorteur.fullName,
        },
        attachmentFile: {
          filename: 'filename',
          id: fileId,
        },
        project: {
          nomProjet: 'nomProjet',
          communeProjet: 'communeProjet',
          departementProjet: 'departementProjet',
          regionProjet: 'regionProjet',
          appelOffreId: 'Fessenheim',
          periodeId: '1',
          familleId: 'familleId',
          unitePuissance: 'MWc', // see fessenheim.ts
        },
        type: 'recours',
        description: 'justification',
      });
    });
  });

  describe('when user is admin', () => {
    const fakePorteur = _creerPorteurProjet();
    const fakeAdmin = _creerAdmin();

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await Project.create(makeFakeProject({ id: projectId }));

      await File.create(makeFakeFile({ id: fileId }));

      await User.create(fakeAdmin);
      await User.create(fakePorteur);

      const baseRequest = {
        projectId,
        type: 'actionnaire' as const,
        userId: fakePorteur.id,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
      };

      await ModificationRequest.bulkCreate([
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          actionnaire: 'target',
          authority: 'dgec',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          actionnaire: 'nottarget',
          authority: 'dreal',
        },
      ]);
    });

    it('should return all modification requests of authority dgec', async () => {
      const res = await getModificationRequestListForAdmin({
        user: fakeAdmin,
        pagination: { page: 0, pageSize: 10 },
      });

      expect(res.isOk()).toBe(true);

      expect(res._unsafeUnwrap().itemCount).toEqual(1);

      expect(res._unsafeUnwrap().items[0]).toMatchObject({ description: 'target' });
    });

    describe('when the noAuthority filter is true', () => {
      it('should return all modification requests of all authorities', async () => {
        const res = await getModificationRequestListForAdmin({
          user: fakeAdmin,
          pagination: { page: 0, pageSize: 10 },
          forceNoAuthority: true,
        });

        expect(res.isOk()).toBe(true);
        expect(res._unsafeUnwrap().itemCount).toEqual(2);
      });
    });
  });

  describe('when user is dreal', () => {
    const fakeDreal = _creerDreal();
    const fakePorteur = _creerPorteurProjet();
    const targetDreal = 'Bretagne';

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase();

      await Project.create(makeFakeProject({ id: projectId, regionProjet: targetDreal }));

      const outsideRegionProjectId = new UniqueEntityID().toString();
      await Project.create(
        makeFakeProject({ id: outsideRegionProjectId, regionProjet: 'Occitanie' }),
      );

      await File.create(makeFakeFile({ id: fileId }));

      await User.create(fakeDreal);
      await User.create(fakePorteur);

      await UserDreal.create({
        userId: fakeDreal.id,
        dreal: targetDreal,
      });

      const baseRequest = {
        projectId,
        userId: fakePorteur.id,
        fileId,
        requestedOn: 123,
        status: 'envoyée',
      };

      await ModificationRequest.bulkCreate([
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'producteur',
          authority: 'dreal',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'autre',
          authority: 'dgec',
        },
        {
          ...baseRequest,
          id: new UniqueEntityID().toString(),
          type: 'recours',
          authority: 'dgec',
        },
        {
          // outside of scope because of project region
          ...baseRequest,
          projectId: outsideRegionProjectId,
          id: new UniqueEntityID().toString(),
          type: 'actionnaire',
          authority: 'dreal',
        },
      ]);
    });

    it(`should return all modification requests of projects from the user's region`, async () => {
      const res = await getModificationRequestListForAdmin({
        user: fakeDreal,
        pagination: { page: 0, pageSize: 10 },
      });

      expect(res.isOk()).toBe(true);

      expect(res._unsafeUnwrap().itemCount).toEqual(3);

      expect(res._unsafeUnwrap().items.length).toEqual(3);

      expect(res._unsafeUnwrap().items).toContainEqual(
        expect.objectContaining({
          authority: 'dreal',
          status: 'envoyée',
          type: 'producteur',
          project: expect.objectContaining({ regionProjet: targetDreal }),
        }),
      );

      expect(res._unsafeUnwrap().items).toContainEqual(
        expect.objectContaining({
          authority: 'dgec',
          status: 'envoyée',
          type: 'autre',
          project: expect.objectContaining({ regionProjet: targetDreal }),
        }),
      );
    });
  });
});

function _creerAdmin(): userEntity & { role: 'admin' } {
  return {
    role: 'admin',
    email: 'mail',
    fullName: 'name',
    id: new UniqueEntityID().toString(),
  };
}

function _creerDreal(): userEntity & { role: 'dreal' } {
  return {
    role: 'dreal',
    email: 'mail',
    fullName: 'name',
    id: new UniqueEntityID().toString(),
  };
}

function _creerPorteurProjet(): userEntity & { role: 'porteur-projet' } {
  return {
    role: 'porteur-projet',
    email: 'mail',
    fullName: 'name',
    id: new UniqueEntityID().toString(),
  };
}
