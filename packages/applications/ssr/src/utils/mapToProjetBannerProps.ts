import { ConsulterCandidatureReadModel } from '@potentiel-domain/candidature';

import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { displayDate } from './displayDate';

type MapToProjetBannerProps = {
  projet: ConsulterCandidatureReadModel;
  identifiantProjet: string;
};

export const mapToProjetBannerProps = ({
  projet,
  identifiantProjet,
}: MapToProjetBannerProps): ProjetBannerProps => ({
  identifiantProjet,
  statut: projet.statut,
  nom: projet.nom,
  appelOffre: projet.appelOffre,
  période: projet.période,
  famille: projet.famille,
  localité: {
    commune: projet.localité.commune,
    département: projet.localité.département,
    région: projet.localité.région,
    codePostal: projet.localité.codePostal,
  },
  dateDésignation: displayDate(projet.dateDésignation),
});
