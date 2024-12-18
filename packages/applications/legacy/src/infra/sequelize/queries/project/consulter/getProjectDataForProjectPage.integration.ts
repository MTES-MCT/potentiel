import { beforeAll, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { EntityNotFoundError } from '../../../../../modules/shared';
import makeFakeFile from '../../../../../__tests__/fixtures/file';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import makeFakeUser from '../../../../../__tests__/fixtures/user';
import { resetDatabase } from '../../../helpers';
import { Project, User, UserProjects, File } from '../../../projectionsNext';
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage';

const certificateFileId = new UniqueEntityID().toString();

const projectId = new UniqueEntityID().toString();
const projectInfo = {
  id: projectId,
  numeroCRE: 'numeroCRE',
  nomProjet: 'nomProjet',
  nomCandidat: 'nomCandidat',
  adresseProjet: 'adresse',
  codePostalProjet: '12345',
  communeProjet: 'communeProjet',
  departementProjet: 'departementProjet',
  regionProjet: 'regionProjet',
  territoireProjet: 'territoireProjet',
  puissance: 123,
  prixReference: 456,
  appelOffreId: 'Fessenheim',
  periodeId: '1',
  familleId: 'familleId',
  engagementFournitureDePuissanceAlaPointe: false,
  isFinancementParticipatif: false,
  isInvestissementParticipatif: true,
  email: 'test@test.test',
  fournisseur: 'fournisseur',
  evaluationCarbone: 132,
  note: 10,

  details: {
    detail1: 'valeurDetail1',
  },

  notifiedOn: new Date(321).getTime(),
  completionDueOn: new Date(5678).getTime(),

  certificateFileId: certificateFileId,

  classe: 'Classé',
  motifsElimination: 'motifsElimination',
};

const user = makeFakeUser({ role: 'admin', id: new UniqueEntityID().toString() });

describe('Sequelize getProjectDataForProjectPage', () => {
  it('should return a ProjectDataForProjectPage dto', async () => {
    await resetDatabase();

    await Project.create(makeFakeProject(projectInfo));
    await File.create(makeFakeFile({ id: certificateFileId, filename: 'filename' }));

    const res = (await getProjectDataForProjectPage({ projectId, user }))._unsafeUnwrap();

    expect(res).toMatchObject({
      id: projectId,

      appelOffreId: 'Fessenheim',
      periodeId: '1',
      familleId: 'familleId',
      numeroCRE: 'numeroCRE',

      puissance: 123,
      prixReference: 456,

      engagementFournitureDePuissanceAlaPointe: false,
      isFinancementParticipatif: false,
      isInvestissementParticipatif: true,

      adresseProjet: 'adresse',
      codePostalProjet: '12345',
      communeProjet: 'communeProjet',
      departementProjet: 'departementProjet',
      regionProjet: 'regionProjet',
      territoireProjet: 'territoireProjet',

      nomProjet: 'nomProjet',
      nomCandidat: 'nomCandidat',
      email: 'test@test.test',
      fournisseur: 'fournisseur',
      evaluationCarbone: 132,
      note: 10,

      details: {
        detail1: 'valeurDetail1',
      },

      notifiedOn: new Date(321),
      completionDueOn: new Date(5678),

      certificateFile: {
        id: certificateFileId,
        filename: 'filename',
      },

      isClasse: true,

      motifsElimination: 'motifsElimination',
    });

    expect(res).not.toHaveProperty([
      'dcrSubmittedOn',
      'dcrDueOn',
      'dcrDate',
      'dcrFile',
      'dcrNumeroDossier',
    ]);
  });

  it('should include a list of users that have access to this project', async () => {
    const userId = new UniqueEntityID().toString();
    const userId2 = new UniqueEntityID().toString();

    await resetDatabase();

    await Project.create(makeFakeProject(projectInfo));
    await User.create(
      makeFakeUser({
        id: userId,
        fullName: 'username',
        email: 'user@test.test',
        registeredOn: new Date(123),
      }),
    );
    await User.create(
      makeFakeUser({
        id: userId2,
        fullName: 'username',
        email: 'user2@test.test',
      }),
    );
    await UserProjects.create({
      userId,
      projectId,
    });
    await UserProjects.create({
      userId: userId2,
      projectId,
    });

    const res = await getProjectDataForProjectPage({ projectId, user });

    expect(res._unsafeUnwrap()).toMatchObject({
      users: expect.arrayContaining([
        { id: userId, fullName: 'username', email: 'user@test.test' },
        { id: userId2, fullName: 'username', email: 'user2@test.test' },
      ]),
    });
  });

  describe('when project is legacy', () => {
    it('should include isLegacy: true', async () => {
      await resetDatabase();

      await Project.create(
        makeFakeProject({ ...projectInfo, appelOffreId: 'Fessenheim', periodeId: '1' }),
      );
      await File.create(makeFakeFile({ id: certificateFileId, filename: 'filename' }));

      const res = (await getProjectDataForProjectPage({ projectId, user }))._unsafeUnwrap();

      expect(res).toMatchObject({
        isLegacy: true,
      });
    });
  });

  describe('when project is not legacy', () => {
    it('should include isLegacy: false', async () => {
      await resetDatabase();

      await Project.create(
        makeFakeProject({ ...projectInfo, appelOffreId: 'Fessenheim', periodeId: '3' }),
      );
      await File.create(makeFakeFile({ id: certificateFileId, filename: 'filename' }));

      const res = (await getProjectDataForProjectPage({ projectId, user }))._unsafeUnwrap();

      expect(res).toMatchObject({
        isLegacy: false,
      });
    });
  });

  describe('when project is not notified', () => {
    beforeAll(async () => {
      await resetDatabase();

      await Project.create(makeFakeProject({ ...projectInfo, notifiedOn: 0 }));
    });

    it('should return EntityNotFoundError for porteur-projet', async () => {
      const user = makeFakeUser({ role: 'porteur-projet' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return EntityNotFoundError for ademe', async () => {
      const user = makeFakeUser({ role: 'ademe' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return EntityNotFoundError for acheteur-obligé', async () => {
      const user = makeFakeUser({ role: 'acheteur-obligé' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return EntityNotFoundError for dreal', async () => {
      const user = makeFakeUser({ role: 'dreal' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res._unsafeUnwrapErr()).toBeInstanceOf(EntityNotFoundError);
    });

    it('should return DTO for admin', async () => {
      const user = makeFakeUser({ role: 'admin' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res.isOk()).toBe(true);
    });

    it('should return DTO for dgec-validateur', async () => {
      const user = makeFakeUser({ role: 'dgec-validateur' });

      const res = await getProjectDataForProjectPage({ projectId, user });
      expect(res.isOk()).toBe(true);
    });
  });
});
