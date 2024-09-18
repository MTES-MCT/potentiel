import { describe, expect, it } from '@jest/globals';
import {
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectImportedDTO, ProjectNotifiedDTO,
  ProjectStatus
} from '../../../../modules/frise';
import { USER_ROLES } from '../../../../modules/users';
import { extractDesignationItemProps } from './extractDesignationItemProps';

describe('extractDesignationItemProps', () => {
  const fakeIdentifiantProjet = 'test#test#$test#$test';
  const status = 'Classé' as ProjectStatus;

  describe(`when there is neither a ProjectImported with a notification date nor a ProjectNotified`, () => {
    it('should return null', () => {
      const projectEventList: ProjectEventDTO[] = [
        {
          type: 'ProjectImported',
          variant: 'admin',
          date: 11,
        } as ProjectImportedDTO,
        {
          type: 'ProjectClaimed',
          variant: 'admin',
          date: 13,
        } as ProjectClaimedDTO,
      ];
      const result = extractDesignationItemProps(projectEventList, status, fakeIdentifiantProjet);
      expect(result).toBeNull();
    });
  });

    describe('when isLegacy is true', () => {
      describe('when user is not dreal', () => {
        for (const role of USER_ROLES.filter((role) => role !== 'dreal')) {
          it('should return a not applicable certificate status', () => {
            const projectEventList = [
              {
                type: 'ProjectNotified',
                variant: role,
                date: 12,
                isLegacy: true,
              } as ProjectNotifiedDTO,
            ];

            const result = extractDesignationItemProps(
              projectEventList,
              status,
              fakeIdentifiantProjet,
            );
            expect(result).toMatchObject({
              certificate: { status: 'not-applicable' },
            });
          });
        }
      });
    });

    describe('when there is a ProjectClaimed event', () => {
      it('should return the certificate from the claim', () => {
        const projectEventList = [
          projectNotifiedEvent,
          {
            type: 'ProjectClaimed',
            variant: 'admin',
            date: 13,
          } as ProjectClaimedDTO,
        ];

        const result = extractDesignationItemProps(projectEventList, status, fakeIdentifiantProjet);
        expect(result).toMatchObject({
          certificate: { date: 13, status: 'uploaded', url: expect.anything() },
        });
      });
    });
  });
});
