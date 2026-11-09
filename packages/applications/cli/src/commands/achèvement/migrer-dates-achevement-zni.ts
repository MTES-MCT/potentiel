import { Command } from '@oclif/core';
import { mediator } from 'mediateur';
import z from 'zod';

import { DateTime, Email } from '@potentiel-domain/common';
import { type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentAdapter, ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema } from '#helpers';

const envSchema = z.object({
  ...dbSchema.shape,
});

export class MigrerDatesAchèvementZNICommand extends Command {
  static override description =
    `Projets dont le gestionnaire est EDF SEI avec date de mise en service transmise (hors Mayotte), 
    -> lorsque le projet n'a pas de date d'achèvement : migrer la date de mise en service en date d'achèvement, 
    -> et supprimer la date de mise en service dans tous les cas`;

  async init() {
    envSchema.parse(process.env);

    Lauréat.registerLauréatUseCases({
      enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
      getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
    });
  }

  async run() {
    try {
      const errors = [];
      const projets = await executeSelect<{
        id_projet: IdentifiantProjet.RawType;
        statut_projet: Exclude<Lauréat.StatutLauréat.RawType, 'abandonné'>;
        date_mise_en_service: DateTime.RawType;
        reference_raccordement: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
      }>(
        `
select 
	l.value->>'identifiantProjet' as id_projet,
	l.value->>'statut' as statut_projet,
	r.value->>'miseEnService.date' as date_mise_en_service,
	r.value->>'miseEnService.référenceDossierRaccordement' as reference_raccordement
from domain_views.projection l
join domain_views.projection r on r.key = format('raccordement|%s', l.value->>'identifiantProjet')
left join domain_views.projection a on a.key = format('abandon|%s', l.value->>'identifiantProjet')
where l.key like 'lauréat|%'
and l.value->>'localité.département' <> 'Mayotte'
and l.value->>'statut' <> 'abandonné'
and r.value->>'miseEnService.date' is not null
and r.value->>'identifiantGestionnaireRéseau' = '23X160203-000021'
and a.value is null;
        `,
      );

      if (!projets.length) {
        throw new Error('❌ Aucun projet concerné');
      }

      console.info(`ℹ️  ${projets.length} projets à traiter`);

      let success = 0;
      for (const {
        id_projet,
        statut_projet,
        date_mise_en_service,
        reference_raccordement,
      } of projets) {
        try {
          console.log(`\n✏️ Traitement projet ${id_projet}`);
          const date = DateTime.now().formatter();
          const user = Email.système.email;

          if (statut_projet === 'actif') {
            await mediator.send<Lauréat.Achèvement.TransmettreDateAchèvementUseCase>({
              type: 'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
              data: {
                identifiantProjetValue: id_projet,
                dateAchèvementValue:
                  DateTime.convertirEnValueType(date_mise_en_service).formatter(),
                transmiseLeValue: date,
                transmiseParValue: user,
              },
            });
            console.log(`✅ Date d'achèvement transmise`);
          }

          await mediator.send<Lauréat.Raccordement.SupprimerDateMiseEnServiceUseCase>({
            type: 'Lauréat.Raccordement.UseCase.SupprimerDateMiseEnService',
            data: {
              identifiantProjetValue: id_projet,
              référenceDossierValue: reference_raccordement,
              suppriméeLeValue: date,
              suppriméeParValue: user,
            },
          });
          console.log(`✅ Date de mise en service supprimée`);

          success++;
        } catch (error) {
          console.log(error);

          errors.push({
            identifiantProjet: id_projet,
            message: error as string,
          });
        }
      }

      process.stdout.write('\n');

      if (success === projets.length) {
        console.info(`\n🎉 Les ${projets.length} projets ont été traités avec succès`);
      } else {
        console.warn(
          `⚠️  Seuls ${success} sur ${projets.length} projets ont été traités avec succès`,
        );
        errors.map((e) => console.log(e.identifiantProjet, e.message));
      }

      console.info('\n✅ Migration terminée');
    } catch (error) {
      console.error(error);
    }
  }
}
