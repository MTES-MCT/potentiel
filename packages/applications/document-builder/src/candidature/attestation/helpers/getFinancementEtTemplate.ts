import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/projet';

export const getFinancementEtTemplate = ({
  période,
  actionnariat,
}: {
  période: AppelOffre.Periode;
  actionnariat?: Candidature.TypeActionnariat.ValueType;
}) => {
  const template = période.certificateTemplate;
  switch (template) {
    case 'cre4.v0':
    case 'cre4.v1':
      return {
        template,
        isFinancementParticipatif: !!actionnariat?.estFinancementParticipatif(),
        isInvestissementParticipatif: !!actionnariat?.estInvestissementParticipatif(),
      };

    case 'ppe2.v1':
      return {
        template,
        isFinancementCollectif: !!actionnariat?.estFinancementCollectif(),
        isGouvernancePartagée: !!actionnariat?.estGouvernancePartagée(),
      };
    case 'ppe2.v2':
      return {
        template,
        logo: période.logo,
        isFinancementCollectif: !!actionnariat?.estFinancementCollectif(),
        isGouvernancePartagée: !!actionnariat?.estGouvernancePartagée(),
      };
    default:
      throw new Error('Impossible de générer une attestation sans modèle de certificat');
  }
};
