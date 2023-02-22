import { ProjectEventListDTO, ProjectImportedDTO, ProjectNotifiedDTO } from '@modules/frise';
import { extractCRItemProps } from './extractCRItemProps';

describe('extractCRItemProps', () => {
  describe(`Utilisateur n'ayant pas les droits`, () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project'];

    it(`le retour doit être null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'cre',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ];
      const result = extractCRItemProps(events, project);
      expect(result).toEqual(null);
    });
  });
  describe(`Projet Eliminé`, () => {
    const project = {
      status: 'Eliminé',
    } as ProjectEventListDTO['project'];

    it(`le retour doit être null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ];
      const result = extractCRItemProps(events, project);
      expect(result).toEqual(null);
    });
  });

  describe(`Projet Abandonné`, () => {
    const project = {
      status: 'Abandonné',
    } as ProjectEventListDTO['project'];

    it(`le retour doit être null`, () => {
      const events = [
        {
          type: 'ProjectNotified',
          variant: 'porteur-projet',
          date: new Date('2022-01-09').getTime(),
        } as ProjectNotifiedDTO,
      ];
      const result = extractCRItemProps(events, project);
      expect(result).toEqual(null);
    });
  });

  describe('Projet lauréat', () => {
    const project = {
      status: 'Classé',
    } as ProjectEventListDTO['project'];

    describe(`s'il n'y a pas d'événement`, () => {
      it('le retour doit être null', () => {
        const events = [];
        const result = extractCRItemProps(events, project);
        expect(result).toBeNull();
      });
    });

    describe(`s'il n'y a pas encore de convention de raccordement`, () => {
      it('on doit retourner des props pour une CR à venir', () => {
        const events = [
          {
            type: 'ProjectImported',
            variant: 'admin',
            date: 11,
          } as ProjectImportedDTO,
        ];

        const result = extractCRItemProps(events, project);

        expect(result).toEqual({
          type: 'convention-de-raccordement',
          status: 'not-submitted',
        });
      });
    });
  });
});
