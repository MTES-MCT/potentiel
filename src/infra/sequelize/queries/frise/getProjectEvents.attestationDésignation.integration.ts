import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { models } from '../../models';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import {
  ProjectCertificateEvents,
  ProjectClaimedEvent,
} from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les attestations de désignation', () => {
  const { Project } = models;
  const projetId = new UniqueEntityID().toString();
  const projet = makeFakeProject({ id: projetId, potentielIdentifier: 'pot-id' });

  // liste des événements à tester

  const projectCertificateGeneratedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectCertificateGenerated',
    valueDate: new Date('2020-01-04').getTime(),
    eventPublishedAt: new Date('2020-01-04').getTime(),
    payload: { certificateFileId: 'fileId' },
  } as ProjectCertificateEvents;

  const projectCertificateRegeneratedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectCertificateRegenerated',
    valueDate: new Date('2020-01-05').getTime(),
    eventPublishedAt: new Date('2020-01-05').getTime(),
    payload: { certificateFileId: 'fileId' },
  } as ProjectCertificateEvents;

  const projectCertificateUpdatedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectCertificateUpdated',
    valueDate: new Date('2020-01-06').getTime(),
    eventPublishedAt: new Date('2020-01-06').getTime(),
    payload: { certificateFileId: 'fileId' },
  } as ProjectCertificateEvents;

  const projectClaimedEvent = {
    id: new UniqueEntityID().toString(),
    projectId: projetId,
    type: 'ProjectClaimed',
    valueDate: new Date('2020-01-07').getTime(),
    eventPublishedAt: new Date('2020-01-07').getTime(),
    payload: {
      attestationDesignationFileId: 'file-id',
      claimedBy: 'someone',
    },
  } as ProjectClaimedEvent;

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(projet);
  });

  const rolesAutorisés = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'cre',
  ];

  describe(`Utilisateurs autorisés à visualiser les attestations de désignation`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les attestations de désignation devraient être retournées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([
          projectCertificateGeneratedEvent,
          projectCertificateRegeneratedEvent,
          projectCertificateUpdatedEvent,
          projectClaimedEvent,
        ]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([
          {
            type: 'ProjectCertificateGenerated',
            potentielIdentifier: projet.potentielIdentifier,
            email: ['admin', 'dgec-validateur'].includes(role) ? projet.email : undefined,
            nomProjet: projet.nomProjet,
            date: projectCertificateGeneratedEvent.valueDate,
            variant: role,
            certificateFileId: 'fileId',
          },
          {
            type: 'ProjectCertificateRegenerated',
            potentielIdentifier: projet.potentielIdentifier,
            email: ['admin', 'dgec-validateur'].includes(role) ? projet.email : undefined,
            nomProjet: projet.nomProjet,
            date: projectCertificateRegeneratedEvent.valueDate,
            variant: role,
            certificateFileId: 'fileId',
          },
          {
            type: 'ProjectCertificateUpdated',
            potentielIdentifier: projet.potentielIdentifier,
            email: ['admin', 'dgec-validateur'].includes(role) ? projet.email : undefined,
            nomProjet: projet.nomProjet,
            date: projectCertificateUpdatedEvent.valueDate,
            variant: role,
            certificateFileId: 'fileId',
          },
          {
            type: 'ProjectClaimed',
            potentielIdentifier: projet.potentielIdentifier,
            nomProjet: projet.nomProjet,
            date: projectClaimedEvent.valueDate,
            email: ['admin', 'dgec-validateur'].includes(role) ? projet.email : undefined,
            variant: role,
            certificateFileId: 'file-id',
            claimedBy: 'someone',
          },
        ]);
      });
    }
  });

  describe(`Utilisateurs non-autorisés à visualiser les attestations de désignation`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les attestations de désignation ne devraient pas être retournées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.bulkCreate([
          projectCertificateGeneratedEvent,
          projectCertificateRegeneratedEvent,
          projectCertificateUpdatedEvent,
          projectClaimedEvent,
        ]);

        const res = await getProjectEvents({ projectId: projetId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([]);
      });
    }
  });
});
