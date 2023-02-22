import { Repository, UniqueEntityID } from '@core/domain';
import { okAsync } from '@core/utils';
import { makeUser } from '@entities';
import { FileObject } from '@modules/file';
import { UnauthorizedError } from '@modules/shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeSignalerDemandeAbandon } from './signalerDemandeAbandon';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';
import { Readable } from 'stream';
import { DemandeDeMêmeTypeDéjàOuverteError } from '..';

const projectId = new UniqueEntityID().toString();
const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
};
const fakeProject = makeFakeProject();
const projectRepo = fakeTransactionalRepo(fakeProject as Project);

describe('signalerDemandeAbandon usecase', () => {
  it(`Lorsque l'utilisateur n'a pas les droits sur le projet
      Alors une erreur UnauthorizedError devrait être retournée.`, async () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
    const shouldUserAccessProject = jest.fn(async () => false);
    const hasDemandeDeMêmeTypeOuverte = jest.fn(() => okAsync(false));
    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    };

    const signalerDemandeAbandon = makeSignalerDemandeAbandon({
      fileRepo,
      shouldUserAccessProject,
      projectRepo,
      hasDemandeDeMêmeTypeOuverte,
    });

    const res = await signalerDemandeAbandon({
      projectId,
      decidedOn: new Date('2022-04-12'),
      status: 'acceptée',
      signaledBy: user,
    });

    expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
  });

  it(`Lorsque l'utilisateur a les droits sur le projet,
      mais qu'une demande d'abandon faite dans Potentiel est à traiter
      Alors une erreur DemandeDeMêmeTypeDéjàOuverteError devrait être retournée.`, async () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
    const shouldUserAccessProject = jest.fn(async () => true);
    const hasDemandeDeMêmeTypeOuverte = jest.fn(() => okAsync(true));
    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    };

    const signalerDemandeAbandon = makeSignalerDemandeAbandon({
      fileRepo,
      shouldUserAccessProject,
      projectRepo,
      hasDemandeDeMêmeTypeOuverte,
    });

    const res = await signalerDemandeAbandon({
      projectId,
      decidedOn: new Date('2022-04-12'),
      status: 'acceptée',
      signaledBy: user,
    });

    expect(res._unsafeUnwrapErr()).toBeInstanceOf(DemandeDeMêmeTypeDéjàOuverteError);
  });

  it(`Lorsque l'utilisateur a les droits sur le projet,
      et qu'aucune demande d'abandon faite dans Potentiel est à traiter
      Alors la méthode signalerDemandeAbandon devrait être appelée et le fichier enregistré`, async () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })));
    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    };
    const shouldUserAccessProject = jest.fn(async () => true);
    const hasDemandeDeMêmeTypeOuverte = jest.fn(() => okAsync(false));

    const signalerDemandeAbandon = makeSignalerDemandeAbandon({
      fileRepo: fileRepo as Repository<FileObject>,
      shouldUserAccessProject,
      projectRepo,
      hasDemandeDeMêmeTypeOuverte,
    });

    const res = await signalerDemandeAbandon({
      projectId,
      decidedOn: new Date('2022-04-12'),
      status: 'acceptée',
      notes: 'notes',
      file: fakeFileContents,
      signaledBy: user,
    });

    expect(res.isOk()).toBe(true);
    expect(shouldUserAccessProject).toHaveBeenCalledWith({
      user,
      projectId,
    });

    expect(fileRepo.save).toHaveBeenCalled();
    expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents);

    const fakeFile = fileRepo.save.mock.calls[0][0];
    expect(fakeProject.signalerDemandeAbandon).toHaveBeenCalledWith({
      decidedOn: new Date('2022-04-12'),
      status: 'acceptée',
      notes: 'notes',
      attachment: { id: fakeFile.id.toString(), name: fakeFileContents.filename },
      signaledBy: user,
    });
  });
});
