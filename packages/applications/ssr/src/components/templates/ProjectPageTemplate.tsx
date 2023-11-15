import { RésuméCandidatureBanner } from '@/components/organisms/ResumeCandidatureBanner';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { Heading1 } from '../atoms/headings';

type ProjectPageTemplate = {
  heading: string;
  candidature: {
    statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';
    nom: string;
    appelOffre: string;
    période: string;
    famille: string;
    localité: {
      commune: string;
      département: string;
      région: string;
      codePostal: string;
    };
    dateDésignation: string;
  };
  identifiantProjet: string;
  children: React.ReactNode;
};

export const ProjectPageTemplate = ({
  heading,
  candidature,
  identifiantProjet,
  children,
}: ProjectPageTemplate) => {
  return (
    <PageTemplate banner={<RésuméCandidatureBanner {...{ ...candidature, identifiantProjet }} />}>
      <Heading1>{heading}</Heading1>
      <div>{children}</div>
    </PageTemplate>
  );
};
