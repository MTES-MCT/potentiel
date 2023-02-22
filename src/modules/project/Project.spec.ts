import { UniqueEntityID } from '@core/domain';
import {
  CahierDesChargesChoisi,
  DonnéesDeRaccordementRenseignées,
  NumeroGestionnaireSubmitted,
} from './events';
import { makeProject } from './Project';

describe(`Fabriquer l'aggregat projet`, () => {
  const projectId = new UniqueEntityID('le-projet');

  describe(`Cahier des charges actuel du projet`, () => {
    it(`Quand on fabrique un projet sans évènement 'CahierDesChargesChoisi'
      Alors le cahier des charges du projet devrait être celui en vigeur à la candidature`, () => {
      const projet = makeProject({
        projectId,
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.cahierDesCharges).toEqual({
        type: 'initial',
      });
    });

    it(`Quand on fabrique un projet avec un évènement 'CahierDesChargesChoisi'
      Alors le projet a un CDC correspondant à celui mentionné dans l'évènement`, () => {
      const projet = makeProject({
        projectId,
        history: [
          new CahierDesChargesChoisi({
            payload: {
              projetId: projectId.toString(),
              choisiPar: 'porteur-projet',
              type: 'modifié',
              paruLe: '30/07/2021',
              alternatif: true,
            },
          }),
        ],
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.cahierDesCharges).toEqual({
        type: 'modifié',
        paruLe: '30/07/2021',
        alternatif: true,
      });
    });
  });

  describe(`Identifiant du gestionnaire de réseau actuel du projet`, () => {
    it(`Quand on fabrique un projet sans évènement 'NumeroGestionnaireSubmitted'
      Alors l'identifiant du gestionnaire de réseau du projet devrait être vide`, () => {
      const projet = makeProject({
        projectId,
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.identifiantGestionnaireRéseau).toEqual('');
    });

    it(`Quand on fabrique un projet avec un évènement 'NumeroGestionnaireSubmitted'
      Alors l'identifiant du gestionnaire de réseau du projet devrait être celui mentionné dans l'évènement`, () => {
      const projet = makeProject({
        projectId,
        history: [
          new NumeroGestionnaireSubmitted({
            payload: {
              projectId: projectId.toString(),
              submittedBy: 'porteur-projet',
              numeroGestionnaire: 'NUMERO-GESTIONNAIRE',
            },
          }),
        ],
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.identifiantGestionnaireRéseau).toEqual('NUMERO-GESTIONNAIRE');
    });
  });

  describe(`Données de raccordement du projet`, () => {
    it(`Quand on fabrique un projet sans évènement 'DonnéesDeRaccordementRenseignées'
      Alors le projet ne devrait pas avoir de date de mise en service
      Et le projet ne devrait pas avoir de date en file d'attente`, () => {
      const projet = makeProject({
        projectId,
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.dateMiseEnService).toBeUndefined();
      expect(projet.dateFileAttente).toBeUndefined();
    });

    it(`Quand on fabrique un projet avec évènement 'DonnéesDeRaccordementRenseignées'
        Alors le projet devrait avoir la date de mise en service des données de raccordement
        Et le projet devrait avoir la date en file d'attente des données de raccordement`, () => {
      const dateMiseEnService = new Date('2024-01-01');
      const dateFileAttente = new Date('2023-01-01');

      const projet = makeProject({
        projectId,
        history: [
          new DonnéesDeRaccordementRenseignées({
            payload: {
              projetId: projectId.toString(),
              dateMiseEnService,
              dateFileAttente,
            },
          }),
        ],
        getProjectAppelOffre: jest.fn(),
        buildProjectIdentifier: jest.fn(),
      })._unsafeUnwrap();

      expect(projet.dateMiseEnService).toEqual(dateMiseEnService);
      expect(projet.dateFileAttente).toEqual(dateFileAttente);
    });
  });
});
