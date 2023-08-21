import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../../core/domain';
import { resetDatabase } from '../../../helpers';
import { Project, GarantiesFinancières } from '../..';
import { ProjectClasseGranted } from '../../../../../modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectClasseGranted } from './onProjectClasseGranted';

describe(`handler onProjectClasseGranted pour la projection garantiesFinancières`, () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const projetId = new UniqueEntityID().toString();
  const occurredAt = new Date('2022-01-04');
  const grantedBy = new UniqueEntityID().toString();

  describe(`Ne rien enregistrer si le projet n'est pas soumis à garanties financières`, () => {
    it(`Etant donné un événement ProjectClasseGranted émis pour un projet non soumis à GF,
    alors aucune entrée ne doit être ajoutée à la table pour le projet`, async () => {
      const projet = makeFakeProject({
        id: projetId,
        classe: 'Classé',
        appelOffreId: 'CRE4 - Autoconsommation ZNI',
        periodeId: '2',
      });
      await Project.create(projet);
      const évènement = new ProjectClasseGranted({
        payload: {
          projectId: projetId,
          grantedBy,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectClasseGranted(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toBe(null);
    });
  });

  describe(`Enregistrer une nouvelle ligne si le projet est soumis à GF`, () => {
    it(`
    Etant donné un projet passant du statut éliminé à classé
    Et ayant un appel d'offre soumis à garanties financières
    Et n'ayant pas de données relatives aux garanties financières transmises dans Potentiel
    Lorsqu'un événement ProjectClasseGranted est émis,
    Alors une nouvelle entrée est ajoutée dans la projection GarantiesFinancières`, async () => {
      const projet = makeFakeProject({
        id: projetId,
        classe: 'Classé',
        appelOffreId: 'PPE2 - Eolien',
        periodeId: '1',
      });

      await Project.create(projet);
      const évènement = new ProjectClasseGranted({
        payload: {
          projectId: projetId,
          grantedBy,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectClasseGranted(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId } });

      expect(GF).toMatchObject({ statut: 'en attente', soumisesALaCandidature: true });
    });
  });

  describe(`Mise à jour de données existantes`, () => {
    it(`
    Etant donné un projet passant du statut éliminé à classé
    Et ayant un appel d'offre soumis à garanties financières
    Et ayant déjà de données relatives aux garanties financières transmises dans Potentiel : type et date échéance
    Lorsqu'un événement ProjectClasseGranted est émis,
    Alors alors les données initiales sont conservées`, async () => {
      const GFId = new UniqueEntityID().toString();
      const dateEchéance = new Date();

      const projet = makeFakeProject({
        id: projetId,
        classe: 'Classé',
        appelOffreId: 'PPE2 - Eolien',
        periodeId: '1',
      });

      await Project.create(projet);

      await GarantiesFinancières.create({
        id: GFId,
        statut: 'en attente',
        projetId,
        soumisesALaCandidature: true,
        type: "Garantie financière avec date d'échéance et à renouveler",
        dateEchéance,
      });

      const évènement = new ProjectClasseGranted({
        payload: {
          projectId: projetId,
          grantedBy,
        },
        original: {
          version: 1,
          occurredAt,
        },
      });

      await onProjectClasseGranted(évènement);

      const GF = await GarantiesFinancières.findOne({ where: { projetId, id: GFId } });

      expect(GF).toMatchObject({
        id: GFId,
        statut: 'en attente',
        projetId,
        soumisesALaCandidature: true,
        type: "Garantie financière avec date d'échéance et à renouveler",
        dateEchéance,
      });
    });
  });
});
