import { CommandHandlerFactory, CommandHandler, QueryHandler } from '@potentiel/core-domain';
import { IdentifiantProjet } from '../../projet';
import { Readable } from 'stream';
import { RemplacerAccuséRéceptionDemandeComplèteRaccordement } from './remplacerAccuséRéceptionDemandeComplèteRaccordement';
import { RenommerPropositionTechniqueEtFinancière } from './renommerPropositionTechniqueEtFinancière';
import { ModifierDemandeComplèteRaccordementCommand } from './modifierDemandeComplèteRaccordement.command';
import { ConsulterDossierRaccordementQuery, DossierRaccordementReadModel } from '../consulter';

type ModifierDemandeComplèteRaccordementUseCase = {
  identifiantProjet: IdentifiantProjet;
  dateQualification: Date;
  ancienneRéférence: string;
  nouvelleRéférence: string;
  nouveauFichier: {
    format: string;
    content: Readable;
  };
};

type ModifierDemandeComplèteRaccordementDependencies = {
  modifierDemandeComplèteRaccordementCommand: CommandHandler<ModifierDemandeComplèteRaccordementCommand>;
  remplacerAccuséRéceptionDemandeComplèteRaccordement: RemplacerAccuséRéceptionDemandeComplèteRaccordement;
  renommerPropositionTechniqueEtFinancière: RenommerPropositionTechniqueEtFinancière;
  consulterDossierRaccordementQuery: QueryHandler<
    ConsulterDossierRaccordementQuery,
    DossierRaccordementReadModel
  >;
};

export const modifierDemandeComplèteRaccordementUseCaseFactory: CommandHandlerFactory<
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierDemandeComplèteRaccordementDependencies
> =
  ({
    remplacerAccuséRéceptionDemandeComplèteRaccordement,
    renommerPropositionTechniqueEtFinancière,
    modifierDemandeComplèteRaccordementCommand,
    consulterDossierRaccordementQuery,
  }) =>
  async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférence,
    nouvelleRéférence,
    nouveauFichier,
  }) => {
    await modifierDemandeComplèteRaccordementCommand({
      identifiantProjet,
      dateQualification,
      ancienneRéférence,
      nouvelleRéférence,
      nouveauFichier,
    });

    const { propositionTechniqueEtFinancière } = await consulterDossierRaccordementQuery({
      identifiantProjet,
      référence: ancienneRéférence,
    });

    await remplacerAccuséRéceptionDemandeComplèteRaccordement({
      identifiantProjet,
      ancienneRéférence,
      nouvelleRéférence,
      nouveauFichier,
    });

    if (propositionTechniqueEtFinancière) {
      await renommerPropositionTechniqueEtFinancière({
        identifiantProjet,
        ancienneRéférence,
        nouvelleRéférence,
        formatAncienFichier: propositionTechniqueEtFinancière?.format,
      });
    }
  };
