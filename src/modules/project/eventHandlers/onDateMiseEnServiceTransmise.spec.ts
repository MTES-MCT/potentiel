import { okAsync } from '../../../core/utils';
import { InfraNotAvailableError } from '../../shared';
import {
  fakeTransactionalRepo,
  makeFakeProject as makeFakeProjectAggregate,
} from '../../../__tests__/fixtures/aggregates';
import { makeOnDateMiseEnServiceTransmise } from './onDateMiseEnServiceTransmise';
import { DomainEvent, UniqueEntityID } from '../../../core/domain';
import { ProjectAppelOffre } from '../../../entities';
import { CahierDesChargesModifié } from '@potentiel/domain-views';
import { Project } from '../Project';
import { DateMiseEnServiceTransmise } from '../events';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

describe(`Handler onDateMiseEnServiceTransmise`, () => {
  const projetId = new UniqueEntityID();
  const appelOffreId = 'Eolien';
  const periodeId = '1';
  const numeroCRE = '123';
  const familleId = '';

  const findProjectByIdentifiers = jest.fn(() => okAsync(projetId.toString()));

  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );

  const getProjectAppelOffre = jest.fn(
    () =>
      ({
        typeAppelOffre: 'eolien',
        periode: {
          cahiersDesChargesModifiésDisponibles: [
            {
              type: 'modifié',
              paruLe: '30/08/2022',
              délaiApplicable: {
                délaiEnMois: 18,
                intervaleDateMiseEnService: {
                  min: new Date('2022-06-01'),
                  max: new Date('2024-09-30'),
                },
              },
            } as CahierDesChargesModifié,
          ] as ReadonlyArray<CahierDesChargesModifié>,
        },
      } as ProjectAppelOffre),
  );

  const récupérerDétailDossiersRaccordements = jest.fn(async () => [
    {
      référence: 'ref-du-dossier',
      miseEnService: { dateMiseEnService: new Date().toISOString() },
      demandeComplèteRaccordement: { dateQualification: new Date().toISOString() },
    },
  ]);

  beforeEach(async () => {
    publishToEventStore.mockClear();
  });

  const dateAchèvementInitiale = new Date('2024-01-01').getTime();

  const nouvelleDateAchèvementAttendue = new Date(
    new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() + 18),
  );

  describe(`Projet pouvant bénéficier du délai de 18 mois`, () => {
    it(`Etant donné un projet éolien
        Et ayant souscrit au CDC 2022 dont la période de l'appel d'offre permet le délai de 18 mois
        Et n'ayant pas déjà bénéficié du délai
        Quand la date de mise en service transmise est comprise entre le 1er juin 2022 et le 30 septembre 2024
        Alors le délai de 18 mois en lien avec le CDC 2022 devrait être appliqué`, async () => {
      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022appliqué: false,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
        findProjectByIdentifiers,
        récupérerDétailDossiersRaccordements,
      });

      const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
        payload: {
          dateMiseEnService: new Date('01/01/2023').toISOString(),
          référenceDossierRaccordement: 'ref-du-dossier',
          identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
        },
      });

      await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

      expect(publishToEventStore).toHaveBeenCalledTimes(1);
      const évènement = publishToEventStore.mock.calls[0][0];
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet');
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'délaiCdc2022',
        }),
      );
    });
  });

  describe(`Projets ne pouvant pas bénéficier du délai de 18 mois`, () => {
    describe(`Date mise en service hors limites du CDC`, () => {
      it(`Etant donné un projet éolien
          Et ayant souscrit au CDC 2022
          Et n'ayant pas déjà bénéficié du délai
          Quand la date de mise en service n'est pas comprise entre le 1er juin 2022 et le 30 septembre 2024 
          Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
        const fakeProject = {
          ...makeFakeProjectAggregate(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
          completionDueOn: dateAchèvementInitiale,
          délaiCDC2022appliqué: false,
          numeroCRE,
          appelOffreId,
          periodeId,
          id: projetId,
          familleId,
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
          findProjectByIdentifiers,
          récupérerDétailDossiersRaccordements,
        });

        const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
          payload: {
            dateMiseEnService: new Date('01/01/2021').toISOString(),
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
          },
        });

        await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Cahier des charges 2022 non souscrit`, () => {
      it(`Etant donné un projet éolien
          Et n'ayant pas souscrit au CDC 2022
          Quand la date de mise en service transmise est comprise entre le 1er juin 2022 et le 30 septembre 2024
          Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
        const fakeProject = {
          ...makeFakeProjectAggregate(),
          cahierDesCharges: { type: 'initial' },
          completionDueOn: dateAchèvementInitiale,
          délaiCDC2022appliqué: false,
          numeroCRE,
          appelOffreId,
          periodeId,
          id: projetId,
          familleId,
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
          findProjectByIdentifiers,
          récupérerDétailDossiersRaccordements,
        });

        const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
          payload: {
            dateMiseEnService: new Date('01/01/2023').toISOString(),
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
          },
        });

        await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Cahier des charges souscrit mais délai de 18 mois non disponible pour la période`, () => {
      it(`Etant donné un projet PPE2 Bâtiment d'une période ne permettant pas les 18 mois (période 3)
          Et ayant souscrit au CDC 2022
          Quand la date de mise en service transmise est comprise entre le 1er juin 2022 et le 30 septembre 2024
          Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
        const fakeProject = {
          ...makeFakeProjectAggregate(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
          completionDueOn: dateAchèvementInitiale,
          délaiCDC2022appliqué: false,
          numeroCRE,
          appelOffreId: 'PPE2 - Bâtiment',
          periodeId: '3',
          id: projetId,
          familleId,
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const getProjectAppelOffre = jest.fn(
          () =>
            ({
              typeAppelOffre: 'batiment',
              periode: {
                cahiersDesChargesModifiésDisponibles: [
                  {
                    type: 'modifié',
                    paruLe: '30/08/2022',
                  } as CahierDesChargesModifié,
                ] as ReadonlyArray<CahierDesChargesModifié>,
              },
            } as ProjectAppelOffre),
        );

        const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
          findProjectByIdentifiers,
          récupérerDétailDossiersRaccordements,
        });

        const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
          payload: {
            dateMiseEnService: new Date('01/01/2023').toISOString(),
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
          },
        });

        await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Délai CDC 2022 déjà appliqué`, () => {
      it(`Etant donné un projet éolien
          Et ayant souscrit au CDC 2022
          Et ayant déjà bénéficié du délai
          Quand la date de mise en service transmise est comprise entre le 1er juin 2022 et le 30 septembre 2024
          Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
        const fakeProject = {
          ...makeFakeProjectAggregate(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
          completionDueOn: dateAchèvementInitiale,
          délaiCDC2022appliqué: true,
          numeroCRE,
          appelOffreId,
          periodeId,
          id: projetId,
          familleId,
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
          findProjectByIdentifiers,
          récupérerDétailDossiersRaccordements,
        });

        const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
          payload: {
            dateMiseEnService: new Date('01/01/2023').toISOString(),
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
          },
        });

        await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });

    describe(`Tous les points d'injection du projet ne sont pas en service`, () => {
      it(`
      Etant donné un projet éolien 
      Et ayant souscrit au CDC 2022 
      Et dont la période permet l'application du délai de 18 mois
      Et n'ayant pas déjà bénéficié du délai de 18 mois
      Et ayant plusieurs points d'injection pas encore mis en service
      Quand une date de mise en service est transmise pour un seul des points d'injection
      Alors le délai de 18 mois en lien avec le CDC 2022 ne devrait pas être appliqué`, async () => {
        const fakeProject = {
          ...makeFakeProjectAggregate(),
          cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
          completionDueOn: dateAchèvementInitiale,
          délaiCDC2022appliqué: false,
          numeroCRE,
          appelOffreId,
          periodeId,
          id: projetId,
          familleId,
        };
        const projectRepo = fakeTransactionalRepo(fakeProject as Project);

        const récupérerDétailDossiersRaccordements = jest.fn(async () => [
          {
            référence: 'ref-du-dossier',
            miseEnService: { dateMiseEnService: new Date().toISOString() },
            demandeComplèteRaccordement: { dateQualification: new Date().toISOString() },
          },
          {
            référence: 'réf-autre-dossier-non-mis-en-service',
            demandeComplèteRaccordement: { dateQualification: new Date().toISOString() },
          },
        ]);

        const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
          projectRepo,
          publishToEventStore,
          getProjectAppelOffre,
          findProjectByIdentifiers,
          récupérerDétailDossiersRaccordements,
        });

        const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
          payload: {
            dateMiseEnService: new Date('01/01/2023').toISOString(),
            référenceDossierRaccordement: 'ref-du-dossier',
            identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
          },
        });

        await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

        expect(publishToEventStore).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe(`Date hors intervalle du CDC pour le délai de 18 mois pour un projet ayant déjà bénéficié du délai`, () => {
    it(`Etant donné un projet éolien
        Et ayant souscrit au CDC 2022
        Et ayant déjà bénéficié du délai relatif au CDC 2022
        Quand une date de mise en service hors de l'intervalle est transmise
        Alors le délai relatif au CDC 2022 appliqué devrait être annulé`, async () => {
      const dateHorsIntervalle = new Date('2020-01-02');

      const nouvelleDateAchèvementAttendue = new Date(
        new Date(dateAchèvementInitiale).setMonth(new Date(dateAchèvementInitiale).getMonth() - 18),
      );

      const fakeProject = {
        ...makeFakeProjectAggregate(),
        cahierDesCharges: { type: 'modifié', paruLe: '30/08/2022' },
        completionDueOn: dateAchèvementInitiale,
        délaiCDC2022appliqué: true,
        numeroCRE,
        appelOffreId,
        periodeId,
        id: projetId,
        familleId,
      };
      const projectRepo = fakeTransactionalRepo(fakeProject as Project);

      const onDateMiseEnServiceTransmise = makeOnDateMiseEnServiceTransmise({
        projectRepo,
        publishToEventStore,
        getProjectAppelOffre,
        findProjectByIdentifiers,
        récupérerDétailDossiersRaccordements,
      });

      const événementDateMiseEnServiceTransmise = new DateMiseEnServiceTransmise({
        payload: {
          dateMiseEnService: dateHorsIntervalle.toISOString(),
          référenceDossierRaccordement: 'ref-du-dossier',
          identifiantProjet: `${appelOffreId}#${periodeId}#${familleId}#${numeroCRE}`,
        },
      });

      await onDateMiseEnServiceTransmise(événementDateMiseEnServiceTransmise);

      expect(publishToEventStore).toHaveBeenCalledTimes(1);
      const évènement = publishToEventStore.mock.calls[0][0];
      expect(évènement.type).toEqual('ProjectCompletionDueDateSet');
      expect(évènement.payload).toEqual(
        expect.objectContaining({
          projectId: fakeProject.id.toString(),
          completionDueOn: nouvelleDateAchèvementAttendue.getTime(),
          reason: 'délaiCdc2022Annulé',
        }),
      );
    });
  });
});
