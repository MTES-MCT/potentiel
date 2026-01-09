import { Metadata, ResolvingMetadata } from 'next';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getCandidature } from '@/app/_helpers';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);

    return {
      title: `${candidature.dépôt.nomProjet} - Potentiel`,
      description: 'Détail de la candidature',
      other: {
        nomProjet: candidature.dépôt.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default async function CandidatureLayout({
  children,
  params: { identifiant },
}: LayoutProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjetValue = decodeParameter(identifiant);
    const { identifiantProjet, notification, dépôt, instruction } =
      await getCandidature(identifiantProjetValue);

    return (
      <PageTemplate
        banner={
          <ProjetBannerTemplate
            identifiantProjet={identifiantProjet}
            href={notification ? Routes.Projet.details(identifiantProjet.formatter()) : undefined}
            nom={dépôt.nomProjet}
            localité={dépôt.localité}
            badge={
              <div className="flex gap-2">
                <StatutCandidatureBadge statut={instruction.statut.statut} />
                <NotificationBadge estNotifié={!!notification} />
              </div>
            }
            dateDésignation={notification ? notification.notifiéeLe.formatter() : Option.none}
          />
        }
      >
        {children}
      </PageTemplate>
    );
  });
}
