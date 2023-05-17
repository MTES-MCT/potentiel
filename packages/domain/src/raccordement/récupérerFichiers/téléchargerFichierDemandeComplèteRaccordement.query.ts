import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatFichierInexistantError,
} from '../raccordement.errors';
import { DossierRaccordementReadModel } from '../consulter/dossierRaccordement.readModel';
import { RécupérerFichierDemandeComplèteRaccordement } from './récupérerFichierDemandeComplèteRaccordement';
import { TéléchargerFichierDemandeComplèteRaccordementReadModel } from './fichierDemandeComplèteRaccordement.readModel';

const TÉLÉCHARGER_FICHIER_DEMANDE_COMPLÈTE_RACCORDEMENT = Symbol(
  'TÉLÉCHARGER_FICHIER_DEMANDE_COMPLÈTE_RACCORDEMENT',
);

type TéléchargerFichierDemandeComplèteRaccordementDependencies = {
  find: Find;
  récupérerFichierDemandeComplèteRaccordement: RécupérerFichierDemandeComplèteRaccordement;
};

export type TéléchargerFichierDemandeComplèteRaccordementQuery = Message<
  typeof TÉLÉCHARGER_FICHIER_DEMANDE_COMPLÈTE_RACCORDEMENT,
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
  },
  TéléchargerFichierDemandeComplèteRaccordementReadModel
>;

export const registerTéléchargerFichierDemandeComplèteRaccordementQuery = ({
  find,
  récupérerFichierDemandeComplèteRaccordement,
}: TéléchargerFichierDemandeComplèteRaccordementDependencies) => {
  const handler: MessageHandler<TéléchargerFichierDemandeComplèteRaccordementQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(dossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (
      !dossierRaccordement.accuséRéception ||
      !dossierRaccordement.accuséRéception.format ||
      dossierRaccordement.accuséRéception.format === 'none'
    ) {
      throw new FormatFichierInexistantError();
    }

    const fichier = await récupérerFichierDemandeComplèteRaccordement({
      identifiantProjet,
      référenceDossierRaccordement,
      format: dossierRaccordement.accuséRéception.format,
    });

    return {
      type: 'fichier-demande-complète-raccordement',
      format: dossierRaccordement.accuséRéception.format,
      content: fichier,
    } as Readonly<TéléchargerFichierDemandeComplèteRaccordementReadModel>;
  };
  mediator.register(TÉLÉCHARGER_FICHIER_DEMANDE_COMPLÈTE_RACCORDEMENT, handler);
};

export const buildTéléchargerFichierDemandeComplèteRaccordementQuery =
  getMessageBuilder<TéléchargerFichierDemandeComplèteRaccordementQuery>(
    TÉLÉCHARGER_FICHIER_DEMANDE_COMPLÈTE_RACCORDEMENT,
  );
