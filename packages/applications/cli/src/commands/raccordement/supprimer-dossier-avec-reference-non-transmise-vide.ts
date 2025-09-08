import { Command } from '@oclif/core';
import { mediator } from 'mediateur';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import { Lauréat } from '@potentiel-domain/projet';

type Dossier = {
  key: string;
  value: Lauréat.Raccordement.DossierRaccordementEntity;
};

const query = `
select * from domain_views.projection 
  where 
    key like '%#Référence non transmise' and value->>'référence' = 'Référence non transmise'
    and value->>'demandeComplèteRaccordement.accuséRéception.format' is null
    and value->>'demandeComplèteRaccordement.dateQualification' is null 
    and value->>'propositionTechniqueEtFinancière.dateSignature' is null 
    and value->>'propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.format' is null 
    and value->>'miseEnService.dateMiseEnService' is null;
`;

export class SupprimerDossierAvecReferenceNonTransmiseVide extends Command {
  static override description =
    "Supprimer les dossiers de raccordement qui ont comme référence 'Référence non transmise' et qui sont vide";

  async run() {
    const dossiers = await executeSelect<Dossier>(query);

    let index = 1;
    for (const dossier of dossiers) {
      console.log(`${index} / ${dossiers.length} : ${dossier.value.identifiantProjet}`);
      try {
        await mediator.send<Lauréat.Raccordement.SupprimerDossierDuRaccordementUseCase>({
          type: 'Lauréat.Raccordement.UseCase.SupprimerDossierDuRaccordement',
          data: {
            identifiantProjetValue: dossier.value.identifiantProjet,
            référenceDossierValue: dossier.value.référence,
          },
        });
      } catch (e) {
        console.error(`Erreur on ${dossier.value.identifiantProjet} (index ${index}) : ${e}`);
      } finally {
        index++;
      }
    }
  }
}
