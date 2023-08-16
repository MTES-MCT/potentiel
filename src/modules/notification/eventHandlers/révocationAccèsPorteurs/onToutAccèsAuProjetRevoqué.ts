import { logger } from '../../../../core/utils';
import { ProjectRepo } from '../../../../dataAccess';
import { ToutAccèsAuProjetRevoqué } from '../../../authZ';
import { NotifierPorteurRévocationAccèsProjet } from '../../useCases';
import { RécupérerDonnéesPorteursParProjetQueryHandler } from '../../../project';

type OnToutAccèsAuProjetRévoqué = (événement: ToutAccèsAuProjetRevoqué) => Promise<void>;

type MakeOnToutAccèsAuProjetRévoqué = (dépendances: {
  notifierPorteurRévocationAccèsProjet: NotifierPorteurRévocationAccèsProjet;
  getProjectUsers: RécupérerDonnéesPorteursParProjetQueryHandler;
  getProject: ProjectRepo['findById'];
}) => OnToutAccèsAuProjetRévoqué;

export const makeOnToutAccèsAuProjetRévoqué: MakeOnToutAccèsAuProjetRévoqué =
  ({ notifierPorteurRévocationAccèsProjet, getProjectUsers, getProject }) =>
  async ({ payload }: ToutAccèsAuProjetRevoqué) => {
    const { projetId, cause } = payload;
    const utilisateursANotifier = await getProjectUsers({ projetId });

    if (utilisateursANotifier.length === 0) {
      return;
    }

    const projet = await getProject(projetId);

    if (!projet) {
      logger.error(
        new Error(`Erreur : onToutAccèsAuProjetRévoqué, projet ${projetId} non trouvé.`),
      );
      return;
    }
    await Promise.all(
      utilisateursANotifier.map((utilisateur) => {
        const { email, fullName: nomPorteur, id } = utilisateur;
        notifierPorteurRévocationAccèsProjet({
          email,
          nomPorteur,
          nomProjet: projet.nomProjet,
          porteurId: id,
          projetId: projetId,
          ...(cause === 'changement producteur' && { cause }),
        });
      }),
    ).catch((error) => logger.error(error));
  };
