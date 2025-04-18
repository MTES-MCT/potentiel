import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

export const getFinancementEtTemplate = ({
  période,
  actionnariat,
}: {
  période: AppelOffre.Periode;
  actionnariat?: Candidature.TypeActionnariat.ValueType;
}) => {
  const ppe2Actionnariat = actionnariat?.estÉgaleÀ(
    Candidature.TypeActionnariat.financementCollectif,
  )
    ? ('financement-collectif' as const)
    : actionnariat?.estÉgaleÀ(Candidature.TypeActionnariat.gouvernancePartagée)
      ? ('gouvernance-partagée' as const)
      : undefined;

  const template = période.certificateTemplate;
  switch (template) {
    case 'cre4.v0':
    case 'cre4.v1':
      return {
        template,
        isFinancementParticipatif: actionnariat?.type === 'financement-participatif',
        isInvestissementParticipatif: actionnariat?.type === 'investissement-participatif',
      };

    case 'ppe2.v1':
      return {
        template,
        actionnariat: ppe2Actionnariat,
      };
    case 'ppe2.v2':
      return {
        template,
        logo: période.logo,
        actionnariat: ppe2Actionnariat,
      };
    default:
      throw new Error('Impossible de générer une attestation sans modèle de certificat');
  }
};
