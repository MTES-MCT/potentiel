import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

const defaultMinistère = 'MCE';
export const getFinancementEtTemplate = ({
  période,
  candidature,
}: {
  période: AppelOffre.Periode;
  candidature: Candidature.ConsulterCandidatureReadModel;
}) => {
  const ppe2Actionnariat = candidature.actionnariat?.estÉgaleÀ(
    Candidature.TypeActionnariat.financementCollectif,
  )
    ? ('financement-collectif' as const)
    : candidature.actionnariat?.estÉgaleÀ(Candidature.TypeActionnariat.gouvernancePartagée)
      ? ('gouvernance-partagée' as const)
      : undefined;
  switch (période.certificateTemplate) {
    case 'cre4.v0':
    case 'cre4.v1':
      return {
        template: période.certificateTemplate,
        isFinancementParticipatif: candidature.actionnariat?.type === 'financement-participatif',
        isInvestissementParticipatif:
          candidature.actionnariat?.type === 'investissement-participatif',
      };

    case 'ppe2.v1':
      return {
        template: période.certificateTemplate,
        actionnariat: ppe2Actionnariat,
      };
    default:
      return {
        template: période.certificateTemplate ?? 'ppe2.v2',
        ministère: période.certificateTemplate === 'ppe2.v2' ? période.ministère : defaultMinistère,
        actionnariat: ppe2Actionnariat,
      };
  }
};
