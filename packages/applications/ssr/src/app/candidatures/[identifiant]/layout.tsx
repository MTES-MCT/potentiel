import type { Metadata, ResolvingMetadata } from 'next';

import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { getCandidature } from '@/app/_helpers';
import { NotificationBadge } from '@/components/molecules/candidature/NotificationBadge';
import { StatutCandidatureBadge } from '@/components/molecules/candidature/StatutCandidatureBadge';
import { ProjetBannerTemplate } from '@/components/molecules/projet/ProjetBanner.template';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

type LayoutProps = IdentifiantParameter & {
  children: React.ReactNode;
};

export async function generateMetadata(
  props: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const candidature = await getCandidature(identifiantProjet);

    return {
      title: {
        template: `%s - ${candidature.dépôt.nomProjet} | Potentiel`,
        default: candidature.dépôt.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default async function CandidatureLayout({ params, children }: LayoutProps) {
  const { identifiant } = await params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
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
              statutBadge={
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
    }),
  );
}
