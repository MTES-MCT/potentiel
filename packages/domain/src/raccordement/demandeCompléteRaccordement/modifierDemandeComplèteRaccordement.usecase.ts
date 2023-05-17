import { mediator, MessageHandler, Message, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet } from '../../projet';
import { Readable } from 'stream';
import { RemplacerAccuséRéceptionDemandeComplèteRaccordement } from './modifierAccuséRéception/modifierAccuséRéceptionDemandeComplèteRaccordement.command';
import { RenommerPropositionTechniqueEtFinancière } from '../propositionTechniqueEtFinancière/renommerPropositionTechniqueEtFinancière';
import { buildModifierDemandeComplèteRaccordementCommand } from './modifier/modifierDemandeComplèteRaccordement.command';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter';

const MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE = Symbol(
  'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
);

type ModifierDemandeComplèteRaccordementUseCase = Message<
  typeof MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
  {
    identifiantProjet: IdentifiantProjet;
    dateQualification: Date;
    ancienneRéférence: string;
    nouvelleRéférence: string;
    nouveauFichier: {
      format: string;
      content: Readable;
    };
  }
>;

type ModifierDemandeComplèteRaccordementDependencies = {
  remplacerAccuséRéceptionDemandeComplèteRaccordement: RemplacerAccuséRéceptionDemandeComplèteRaccordement;
  renommerPropositionTechniqueEtFinancière: RenommerPropositionTechniqueEtFinancière;
};

export const registerDemandeComplèteRaccordementUseCase = ({
  remplacerAccuséRéceptionDemandeComplèteRaccordement,
  renommerPropositionTechniqueEtFinancière,
}: ModifierDemandeComplèteRaccordementDependencies) => {
  const runner: MessageHandler<ModifierDemandeComplèteRaccordementUseCase> = async ({
    identifiantProjet,
    dateQualification,
    ancienneRéférence,
    nouvelleRéférence,
    nouveauFichier,
  }) => {
    await mediator.send(
      buildModifierDemandeComplèteRaccordementCommand({
        identifiantProjet,
        dateQualification,
        ancienneRéférence,
        nouvelleRéférence,
        nouveauFichier,
      }),
    );

    const { propositionTechniqueEtFinancière } = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: ancienneRéférence,
      }),
    );

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

  mediator.register(MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE, runner);
};

export const buildModifierDemandeComplèteRaccordementUseCase = getMessageBuilder(
  MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE,
);
