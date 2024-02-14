import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DomainEvent, UniqueEntityID } from '../../../../core/domain';
import { okAsync } from '../../../../core/utils';
import { User } from '../../../../entities';
import { InfraNotAvailableError } from '../../../shared';
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates';
import { Readable } from 'stream';
import { makeCorrigerDélaiAccordé } from './corrigerDélaiAccordé';
import { FileObject } from '../../../file';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { statutsDemandeDélai } from '../DemandeDélai';
import { CorrectionDélaiNonAccordéImpossibleError } from './CorrectionDélaiNonAccordéImpossibleError';
import { CorrectionDélaiImpossibleCarProjetNonClasséError } from './CorrectionDélaiImpossibleCarProjetNonClasséError';
import { DateAntérieureDateAchèvementInitialeError } from './DateAntérieureDateAchèvementInitialeError';
import { NouvelleCorrectionDélaiAccordéImpossible } from './NouvelleCorrectionDélaiAccordéImpossibleError';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';

describe(`Use-case corriger un délai accordé`, () => {
  const dateAchèvementActuelle = new Date('2026-01-01');
  const projetId = new UniqueEntityID();
  const appelOffreId = 'Eolien';
  const periodeId = '1';
  const familleId = '1';
  const numeroCRE = '12';
  const identifiantProjet = formatProjectDataToIdentifiantProjetValueType({
    appelOffreId,
    periodeId,
    familleId,
    numeroCRE,
  }).formatter();

  // arguments valides à passer à au use-case
  const demandeDélaiId = new UniqueEntityID('id').toString();
  const dateAchèvementProjetInitiale = new Date('2024-01-01');
  const dateAchèvementAccordée = new Date('2025-01-01');
  const explications = 'délai appliqué deux fois';
  const fichierRéponse = {
    contents: Readable.from('test-content'),
    filename: 'fichier-réponse',
  };
  const user = { role: 'admin', id: new UniqueEntityID().toString() } as User;

  // dépendances
  const shouldUserAccessProject = async () => true;
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );
  const fileRepo = fakeRepo<FileObject>();
  const projectRepo = fakeRepo(
    makeFakeProject({
      completionDueOn: dateAchèvementActuelle.toISOString(),
      isClasse: true,
      abandonedOn: 0,
      appelOffreId,
      periodeId,
      familleId,
      data: { numeroCRE },
    }),
  );
  const demandeDélai = makeFakeDemandeDélai({
    id: demandeDélaiId,
    statut: 'accordée',
    projetId: projetId.toString(),
  });
  const demandeDélaiRepo = { ...fakeTransactionalRepo(demandeDélai), ...fakeRepo(demandeDélai) };

  beforeEach(() => {
    publishToEventStore.mockClear();
    fileRepo.save.mockClear();
  });
  describe(`Cas nominal : correction appliquée`, () => {
    it(`
        Etant donné un projet lauréat
        Et une demande de délai accordée
        Lorsqu'un utilisateur 'admin' corrige le délai accordé
        Alors le délai devrait être corrigé
        `, async () => {
      const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
        publishToEventStore,
        fileRepo,
        projectRepo,
        demandeDélaiRepo,
        shouldUserAccessProject,
      });

      const résultat = await corrigerDélaiAccordé({
        demandeDélaiId,
        fichierRéponse,
        explications,
        dateAchèvementAccordée,
        user,
        dateAchèvementProjetInitiale,
        projectLegacyId: projetId.toString(),
      });

      expect(résultat.isOk()).toBe(true);
      expect(fileRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          designation: 'modification-request-response',
          forProject: { value: projetId.toString() },
          filename: fichierRéponse.filename,
          path: `projects/${projetId}/fichier-réponse`,
        }),
      );
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'DélaiAccordéCorrigé',
          payload: expect.objectContaining({
            dateAchèvementAccordée: dateAchèvementAccordée.toISOString(),
            projectLegacyId: projetId.toString(),
            corrigéPar: user.id,
            demandeDélaiId,
            fichierRéponseId: expect.any(String),
            explications,
            ancienneDateThéoriqueAchèvement: dateAchèvementActuelle.toISOString(),
            identifiantProjet,
          }),
        }),
      );
    });
  });
  describe(`Cas en erreur : correction rejetée`, () => {
    describe(`Erreur si la demande n'a pas le statut 'accordé'`, () => {
      for (const statut of statutsDemandeDélai.filter((statut) => statut !== 'accordée')) {
        it(`
        Etant donné un projet lauréat
        Et une demande de délai ${statut}
        Lorsqu'un utilisateur 'admin' corrige le délai accordé
        Alors le délai ne devrait pas être corrigé et le fichier ne devrait pas être sauvegardé
        `, async () => {
          const demandeDélai = makeFakeDemandeDélai({
            id: demandeDélaiId,
            statut,
            projetId: projetId.toString(),
          });
          const demandeDélaiRepo = {
            ...fakeTransactionalRepo(demandeDélai),
            ...fakeRepo(demandeDélai),
          };

          const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
            publishToEventStore,
            fileRepo,
            projectRepo,
            demandeDélaiRepo,
            shouldUserAccessProject,
          });

          const résultat = await corrigerDélaiAccordé({
            demandeDélaiId,
            fichierRéponse,
            explications,
            dateAchèvementAccordée,
            user,
            dateAchèvementProjetInitiale,
            projectLegacyId: projetId.toString(),
          });

          expect(résultat.isErr()).toBe(true);
          expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(
            CorrectionDélaiNonAccordéImpossibleError,
          );
          expect(fileRepo.save).not.toHaveBeenCalled();
          expect(publishToEventStore).not.toHaveBeenCalled();
        });
      }
    });
    describe(`Erreur si le projet est éliminé`, () => {
      it(`
        Etant donné un projet éliminé
        Et une demande de délai accordée
        Lorsqu'un utilisateur 'admin' corrige le délai accordé
        Alors le délai ne devrait pas être corrigé et le fichier ne devrait pas être sauvegardé
        `, async () => {
        const projectRepo = fakeRepo(
          makeFakeProject({
            completionDueOn: dateAchèvementActuelle.toISOString(),
            isClasse: false,
            abandonedOn: 0,
            appelOffreId,
            periodeId,
            familleId,
            data: { numeroCRE },
          }),
        );

        const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
          publishToEventStore,
          fileRepo,
          projectRepo,
          demandeDélaiRepo,
          shouldUserAccessProject,
        });

        const résultat = await corrigerDélaiAccordé({
          demandeDélaiId,
          fichierRéponse,
          explications,
          dateAchèvementAccordée,
          user,
          dateAchèvementProjetInitiale,
          projectLegacyId: projetId.toString(),
        });

        expect(résultat.isErr()).toBe(true);
        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(
          CorrectionDélaiImpossibleCarProjetNonClasséError,
        );
        expect(fileRepo.save).not.toHaveBeenCalled();
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
    describe(`Erreur si le projet est abandonné`, () => {
      it(`
        Etant donné un projet éliminé
        Et une demande de délai accordée
        Lorsqu'un utilisateur 'admin' corrige le délai accordé
        Alors le délai ne devrait pas être corrigé et le fichier ne devrait pas être sauvegardé
        `, async () => {
        const projectRepo = fakeRepo(
          makeFakeProject({
            completionDueOn: dateAchèvementActuelle.toISOString(),
            isClasse: true,
            abandonedOn: new Date().getTime(),
            appelOffreId,
            periodeId,
            familleId,
            data: { numeroCRE },
          }),
        );

        const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
          publishToEventStore,
          fileRepo,
          projectRepo,
          demandeDélaiRepo,
          shouldUserAccessProject,
        });

        const résultat = await corrigerDélaiAccordé({
          demandeDélaiId,
          fichierRéponse,
          explications,
          dateAchèvementAccordée,
          user,
          dateAchèvementProjetInitiale,
          projectLegacyId: projetId.toString(),
        });

        expect(résultat.isErr()).toBe(true);
        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(
          CorrectionDélaiImpossibleCarProjetNonClasséError,
        );
        expect(fileRepo.save).not.toHaveBeenCalled();
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
    describe(`Erreur si la nouvelle date d'achèvement est antérieur à la date d'achèvement initiale du projet`, () => {
      it(`
        Etant donné un projet lauréat
        Et une demande de délai accordée
        Lorsqu'un utilisateur 'admin' corrige le délai accordé avec une date d'achèvement antérieure à la date d'achèvement initiale du projet
        Alors le délai ne devrait pas être corrigé et le fichier ne devrait pas être sauvegardé
        `, async () => {
        const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
          publishToEventStore,
          fileRepo,
          projectRepo,
          demandeDélaiRepo,
          shouldUserAccessProject,
        });

        const résultat = await corrigerDélaiAccordé({
          demandeDélaiId,
          fichierRéponse,
          explications,
          user,
          dateAchèvementAccordée: new Date('2023-01-01'),
          dateAchèvementProjetInitiale: new Date('2024-01-01'),
          projectLegacyId: projetId.toString(),
        });

        expect(résultat.isErr()).toBe(true);
        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(
          DateAntérieureDateAchèvementInitialeError,
        );
        expect(fileRepo.save).not.toHaveBeenCalled();
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
    describe(`Erreur si le délai accordé a déjà été corrigé`, () => {
      it(`
        Etant donné un projet lauréat
        Et une demande de délai accordée
        Et une correction du délai accordé
        Lorsqu'un utilisateur 'admin' corrige le délai accordé
        Alors l'utilisateur devrait être informé qu'il ne peut pas corriger plusieurs fois le même délai accordé
        `, async () => {
        const demandeDélai = makeFakeDemandeDélai({
          id: demandeDélaiId,
          statut: 'accordée',
          projetId: projetId.toString(),
          correctionDélaiAccordé: {
            dateAchèvementAccordée: dateAchèvementAccordée.toISOString(),
            dateCorrection: new Date('2023-10-31').toISOString(),
          },
        });
        const demandeDélaiRepo = {
          ...fakeTransactionalRepo(demandeDélai),
          ...fakeRepo(demandeDélai),
        };

        const corrigerDélaiAccordé = makeCorrigerDélaiAccordé({
          publishToEventStore,
          fileRepo,
          projectRepo,
          demandeDélaiRepo,
          shouldUserAccessProject,
        });

        const résultat = await corrigerDélaiAccordé({
          demandeDélaiId,
          fichierRéponse,
          explications,
          dateAchèvementAccordée,
          user,
          dateAchèvementProjetInitiale,
          projectLegacyId: projetId.toString(),
        });

        expect(résultat.isErr()).toBe(true);
        expect(résultat._unsafeUnwrapErr()).toBeInstanceOf(
          NouvelleCorrectionDélaiAccordéImpossible,
        );
        expect(fileRepo.save).not.toHaveBeenCalled();
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
  });
});
