import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

export const getFinancementEtTemplate = ({
  période,
  candidature,
}: {
  période: AppelOffre.Periode;
  candidature: Candidature.ConsulterCandidatureReadModel;
}) => {
  switch (période.certificateTemplate) {
    case 'cre4.v0':
    case 'cre4.v1':
      return {
        template: période.certificateTemplate,
        isFinancementParticipatif: candidature.actionnariat?.type === 'financement-participatif',
        isInvestissementParticipatif:
          candidature.actionnariat?.type === 'investissement-participatif',
      };
    default:
      return {
        template: période.certificateTemplate ?? 'ppe2.v2',
        actionnariat: candidature.actionnariat?.estÉgaleÀ(
          Candidature.TypeActionnariat.financementCollectif,
        )
          ? ('financement-collectif' as const)
          : candidature.actionnariat?.estÉgaleÀ(Candidature.TypeActionnariat.gouvernancePartagée)
            ? ('gouvernance-partagée' as const)
            : undefined,
      };
  }
};
