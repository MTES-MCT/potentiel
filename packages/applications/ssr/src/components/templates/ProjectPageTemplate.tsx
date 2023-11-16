import { RésuméCandidatureBanner } from '@/components/organisms/ResumeCandidatureBanner';
import { PageTemplate } from '@/components/templates/PageTemplate';
import { Heading1 } from '../atoms/headings';

type ProjectPageTemplate = {
  heading: React.ReactNode;
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
  retour?: { title: string; url: string };
  children: React.ReactNode;
};

export const ProjectPageTemplate = ({
  heading,
  candidature,
  identifiantProjet,
  retour,
  children,
}: ProjectPageTemplate) => {
  return (
    <PageTemplate
      retour={retour}
      banner={<RésuméCandidatureBanner {...{ ...candidature, identifiantProjet }} />}
    >
      <Heading1 className="mt-0 mb-8">{heading}</Heading1>
      <div>{children}</div>
    </PageTemplate>
  );
};
