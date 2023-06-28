import { User } from '@entities';
import { GarantiesFinancièresStatut } from '@infra/sequelize';
import { GarantiesFinancièresDTO } from '@modules/frise';
import { userIs } from '@modules/users';
import routes from '@routes';

type GarantiesFinancièresDonnéesPourDTO = {
  statut: GarantiesFinancièresStatut;
  dateLimiteEnvoi: Date | null;
  dateConstitution: Date | null;
  dateEchéance: Date | null;
  type: string | null;
  validéesPar: string | null;
  fichier?: { filename: string; id: string };
  envoyéesParRef?: { role: 'admin' | 'dreal' | 'porteur-projet' };
};

export const getGarantiesFinancièresDTO = async ({
  garantiesFinancières,
  user,
}: {
  garantiesFinancières: GarantiesFinancièresDonnéesPourDTO | undefined;
  user: User;
}): Promise<GarantiesFinancièresDTO | undefined> => {
  if (
    !userIs(['porteur-projet', 'admin', 'dgec-validateur', 'dreal', 'caisse-des-dépôts', 'cre'])(
      user,
    )
  )
    return;
  if (!garantiesFinancières) return;

  const {
    statut,
    dateConstitution,
    dateEchéance,
    type,
    validéesPar,
    dateLimiteEnvoi,
    fichier,
    envoyéesParRef,
  } = garantiesFinancières;

  if (statut === 'à traiter' || statut === 'validé') {
    return {
      type: 'garanties-financières',
      ...(type && { typeGarantiesFinancières: type }),
      date: dateConstitution!.getTime(),
      statut,
      url: fichier! && routes.DOWNLOAD_PROJECT_FILE(fichier.id, fichier.filename),
      ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
      envoyéesPar: envoyéesParRef! && envoyéesParRef.role,
      variant: user.role,
      ...(statut === 'validé' &&
        ['admin', 'dreal', 'dgec-validateur', 'cre', 'caisse-des-dépôts'].includes(user.role) && {
          retraitDépôtPossible: true,
        }),
      ...(statut === 'à traiter' &&
        ['porteur-projet', 'caisse-des-dépôts'].includes(user.role) && {
          retraitDépôtPossible: true,
        }),
    };
  }

  if (statut === 'en attente') {
    const dateLimiteDépassée = (dateLimiteEnvoi && dateLimiteEnvoi <= new Date()) || false;
    return {
      type: 'garanties-financières',
      ...(type && { typeGarantiesFinancières: type }),
      ...(dateEchéance && { dateEchéance: dateEchéance.getTime() }),
      date: dateLimiteEnvoi?.getTime() || 0,
      statut: dateLimiteDépassée ? 'en retard' : 'en attente',
      variant: user.role,
    };
  }
};
