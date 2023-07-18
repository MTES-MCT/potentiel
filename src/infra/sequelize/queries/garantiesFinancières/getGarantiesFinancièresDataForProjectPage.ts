import { User as PotentielUser } from '@entities';
import { GarantiesFinancières, File, User } from '@infra/sequelize/projectionsNext';
import { userIs } from '@modules/users';
import routes from '@routes';

//TO DO : revoir les droits de modification par role

export type GarantiesFinancièresDataForProjectPage = {
  typeGarantiesFinancières?: string;
  dateEchéance?: number;
} & (
  | {
      statut: 'en attente' | 'en retard';
      dateLimiteEnvoi?: number;
    }
  | {
      statut: 'validé' | 'à traiter';
      envoyéesPar: PotentielUser['role'];
      url: string;
      dateConstitution: number;
    }
);

type GetGarantiesFinancièresDataForProjectPage = ({
  projetId,
  user,
}: {
  projetId: string;
  user: PotentielUser;
}) => Promise<GarantiesFinancièresDataForProjectPage | undefined>;

export const getGarantiesFinancièresDataForProjectPage: GetGarantiesFinancièresDataForProjectPage =
  async ({ projetId, user }) => {
    if (
      !userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'caisse-des-dépôts', 'cre'])(
        user,
      )
    ) {
      return;
    }
    const rawData = await GarantiesFinancières.findOne({
      where: { projetId },
      attributes: [
        'statut',
        'fichierId',
        'envoyéesPar',
        'dateConstitution',
        'dateEchéance',
        'dateLimiteEnvoi',
        'type',
        'soumisesALaCandidature',
      ],
      include: [
        {
          model: File,
          as: 'fichier',
          required: false,
          attributes: ['filename', 'id'],
        },
        { model: User, as: 'envoyéesParRef', required: false, attributes: ['role'] },
      ],
    });

    if (!rawData) {
      return;
    }

    const {
      statut,
      dateEchéance,
      type,
      dateConstitution,
      dateLimiteEnvoi,
      fichier,
      envoyéesParRef,
    } = rawData;

    if (statut === 'à traiter' || statut === 'validé') {
      return {
        statut,
        dateConstitution: dateConstitution!.getTime(),
        url: fichier! && routes.DOWNLOAD_PROJECT_FILE(fichier.id, fichier.filename),
        envoyéesPar: envoyéesParRef! && envoyéesParRef.role,
        ...(type && { typeGarantiesFinancières: type }),
        ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
      };
    }

    if (statut === 'en attente') {
      const dateLimiteDépassée = (dateLimiteEnvoi && dateLimiteEnvoi <= new Date()) || false;

      if (user.role === 'porteur-projet') {
        return {
          statut: dateLimiteDépassée ? 'en retard' : 'en attente',
          ...(type && { typeGarantiesFinancières: type }),
          ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
          ...(dateLimiteEnvoi && { dateLimiteEnvoi: dateLimiteEnvoi?.getTime() }),
        };
      }

      return {
        statut: dateLimiteDépassée ? 'en retard' : 'en attente',
        ...(type && { typeGarantiesFinancières: type }),
        ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
        ...(dateLimiteEnvoi && { dateLimiteEnvoi: dateLimiteEnvoi?.getTime() }),
      };
    }
  };
