import { describe, expect, it } from '@jest/globals';
import ROUTES from '../../../routes';
import { porteurProjetActions } from '.';
import makeFakeProject from '../../../__tests__/fixtures/project';

describe('porteurProjetActions', () => {
  describe('when project is abandoned', () => {
    it('should return an empty action array', () => {
      const fakeProject = makeFakeProject({
        isAbandoned: true,
        appelOffre: {
          appelOffre: { changementProducteurPossibleAvantAchèvement: true },
        },
      });
      const result = porteurProjetActions(fakeProject);
      expect(result).toEqual([]);
    });
  });
  describe('when project is not "classé"', () => {
    describe('when project has a certificate file', () => {
      it('should return certificate link and "recours" link', () => {
        const fakeProject = makeFakeProject({
          isClasse: false,
          appelOffre: { changementProducteurPossibleAvantAchèvement: true },
          certificateFile: {
            id: '1',
            filename: 'file-name',
          },
        });
        const result = porteurProjetActions(fakeProject);
        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
          title: 'Télécharger mon attestation',
          link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
            id: fakeProject.id,
            certificateFileId: fakeProject.certificateFile.id,
            nomProjet: fakeProject.nomProjet,
            potentielIdentifier: fakeProject.potentielIdentifier,
          }),
          isDownload: true,
        });
        expect(result[1]).toMatchObject({
          title: 'Faire une demande de recours',
          link: ROUTES.DEPOSER_RECOURS(fakeProject.id),
        });
      });
    });
    describe('when project is "classé"', () => {
      it('should return an action array with the following actions: "Demander un délai", "Changer de producteur", "Changer de fournisseur", "Changer d\'actionnaire", "Changer de puissance", "Demander un abandon"', () => {
        const fakeProject = makeFakeProject({
          isClasse: true,
          appelOffre: { changementProducteurPossibleAvantAchèvement: true },
        });
        const result = porteurProjetActions(fakeProject);
        expect(result).toHaveLength(6);
        expect(result).toEqual([
          {
            title: 'Demander un délai',
            link: ROUTES.DEMANDER_DELAI(fakeProject.id),
          },
          {
            title: 'Changer de producteur',
            link: ROUTES.GET_CHANGER_PRODUCTEUR(fakeProject.id),
          },
          {
            title: 'Changer de fournisseur',
            link: ROUTES.CHANGER_FOURNISSEUR(fakeProject.id),
          },
          {
            title: "Changer d'actionnaire",
            link: ROUTES.CHANGER_ACTIONNAIRE(fakeProject.id),
          },
          {
            title: 'Changer de puissance',
            link: ROUTES.DEMANDER_CHANGEMENT_PUISSANCE(fakeProject.id),
          },
          {
            title: 'Demander un abandon',
            link: ROUTES.GET_DEMANDER_ABANDON(fakeProject.id),
          },
        ]);
      });
      describe('when project has a certificate file', () => {
        it('should return also a link to get this file', () => {
          const fakeProject = makeFakeProject({
            isClasse: true,
            appelOffre: { changementProducteurPossibleAvantAchèvement: true },
            certificateFile: {
              id: '1',
              filename: 'file-name',
            },
          });
          const result = porteurProjetActions(fakeProject);
          expect(result).toHaveLength(7);
          expect(result[0]).toMatchObject({
            title: 'Télécharger mon attestation',
            link: ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
              id: fakeProject.id,
              certificateFileId: fakeProject.certificateFile.id,
              nomProjet: fakeProject.nomProjet,
              potentielIdentifier: fakeProject.potentielIdentifier,
            }),
            isDownload: true,
          });
        });
      });
      describe('when the AO cannot change producteur before achevement', () => {
        it('should not return "changement de producteur" action', () => {
          const fakeProject = makeFakeProject({
            isClasse: true,
            appelOffre: { changementProducteurPossibleAvantAchèvement: false },
          });
          const result = porteurProjetActions(fakeProject);
          expect(result).toHaveLength(5);
          expect(result).toEqual([
            {
              title: 'Demander un délai',
              link: ROUTES.DEMANDER_DELAI(fakeProject.id),
            },
            {
              title: 'Changer de fournisseur',
              link: ROUTES.CHANGER_FOURNISSEUR(fakeProject.id),
            },
            {
              title: "Changer d'actionnaire",
              link: ROUTES.CHANGER_ACTIONNAIRE(fakeProject.id),
            },
            {
              title: 'Changer de puissance',
              link: ROUTES.DEMANDER_CHANGEMENT_PUISSANCE(fakeProject.id),
            },
            {
              title: 'Demander un abandon',
              link: ROUTES.GET_DEMANDER_ABANDON(fakeProject.id),
            },
          ]);
        });
      });
    });
  });
});
