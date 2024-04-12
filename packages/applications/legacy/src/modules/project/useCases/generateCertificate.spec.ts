import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { Repository, UniqueEntityID } from '../../../core/domain';
import { ok, okAsync } from '../../../core/utils';
import { AppelOffre, CertificateTemplate, Validateur } from '@potentiel-domain/appel-offre';
import { fakeRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { FileObject } from '../../file';
import { OtherError, InfraNotAvailableError } from '../../shared';

import makeFakeUser from '../../../__tests__/fixtures/user';
import { ProjectDataForCertificate } from '../dtos';
import { Project } from '../Project';
import { makeGenerateCertificate } from './generateCertificate';
import { User } from '../../../infra/sequelize/projectionsNext';
import { AppelOffreRepo } from '../../../dataAccess';

const projectId = 'project1';

const fakeProjectData = {};

const fakeProject = {
  ...makeFakeProject(),
  certificateData: ok({ template: 'v0', data: fakeProjectData as ProjectDataForCertificate }),
  id: new UniqueEntityID(projectId),
};

const projectRepo = fakeRepo(fakeProject as Project);

const validateurId = new UniqueEntityID().toString();

describe('useCase generateCertificate', () => {
  /* global NodeJS */
  const buildCertificate = jest.fn(
    (args: {
      template: CertificateTemplate;
      data: ProjectDataForCertificate;
      validateur: Validateur;
    }) =>
      okAsync<NodeJS.ReadableStream, OtherError>(Readable.from('test') as NodeJS.ReadableStream),
  );

  const fileRepo = {
    save: jest.fn((file: FileObject) => okAsync(null)),
    load: jest.fn(),
  };

  const findAppelOffreById: AppelOffreRepo['findById'] = async () =>
    ({
      id: 'appelOffreId',
      periodes: [{ id: 'periodeId', type: 'notified', choisirNouveauCahierDesCharges: true }],
      familles: [{ id: 'familleId' }],
    } as AppelOffre);

  const user = makeFakeUser({ id: validateurId, fonction: 'directeur' });
  const getUserById = jest.fn((id: string) => okAsync<User | null, InfraNotAvailableError>(user));

  const generateCertificate = makeGenerateCertificate({
    fileRepo: fileRepo as Repository<FileObject>,
    projectRepo,
    buildCertificate,
    findAppelOffreById,
    getUserById,
  });

  beforeAll(async () => {
    const res = await generateCertificate({ projectId, validateurId });
    expect(res.isOk()).toBe(true);
  });

  it('Le projet devrait être chargé', () => {
    expect(projectRepo.load).toHaveBeenCalledWith(new UniqueEntityID(projectId));
  });

  it('Un pdf utilisant le template défini par la période du projet devrait être généré', async () => {
    expect(buildCertificate).toHaveBeenCalledWith({
      template: 'v0',
      data: fakeProjectData,
      validateur: { fullName: user.fullName, fonction: user.fonction },
    });
  });

  it(`Le pdf devrait être enregistré à l'aide du file service`, () => {
    expect(fileRepo.save).toHaveBeenCalled();
  });

  it('La méthode project.addGeneratedCertificate() devrait être appelée', () => {
    expect(fakeProject.addGeneratedCertificate).toHaveBeenCalled();
  });

  it('Le projet devrait être sauvegardé', () => {
    expect(projectRepo.save).toHaveBeenCalledWith(fakeProject);
  });
});
