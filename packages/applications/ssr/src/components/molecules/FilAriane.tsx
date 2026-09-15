'use client';

import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb';
import { usePathname } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';

export function FilAriane() {
  const pathname = usePathname();
  const rawSegments = pathname.split('/').filter(Boolean);

  const actions = ['modifier', 'changement', 'signaler', 'transmettre'];

  const getSegmentsToDisplay = (segments: string[]) => {
    const lastSegment = segments.at(-1);
    if (!lastSegment) {
      return [];
    }
    // Si la page actuelle est une action (chemin se termine par une action)
    // exemple : /laureats/PPE4 - Sol#projet1/actionnaire/modifier
    // attendu laureats > PPE4 - Sol#projet1 > modifier actionnaire
    if (lastSegment && actions.includes(lastSegment)) {
      return [...segments.slice(0, -2), `${lastSegment} ${segments.at(-2)}`];
    }

    // Si la page actuelle est le détail d'un changement (chemin se termine par une date)
    // exemple : /laureats/PPE4 - Sol#projet1/actionnaire/changement/2023-01-27T14:33:45.383Z
    // attendu : lauréats > PPE4 - Sol#projet1 > changement actionnaire
    const isLastSegmentDate = !Number.isNaN(new Date(lastSegment).getTime());
    if (isLastSegmentDate) {
      return [...segments.slice(0, -3), `${segments.at(-2)} ${segments.at(-3)}`];
    }

    // Si la page actuelle est un formulaire de modification de raccordement
    // exemple : /laureats/PPE4 - Sol#projet1/raccordements/REFDOSSIER01/demande-complete-raccordement/modifier
    // attendu : lauréats > PPE4 - Sol#projet1 > raccordements > modifier demande complete raccordement REFDOSSIER01
    // TODO

    const segmentsÀIgnorer = ['changements', 'reseaux'];

    return segments.filter((seg) => !segmentsÀIgnorer.includes(seg));
  };

  const segmentsToDisplay = getSegmentsToDisplay(rawSegments);

  const getLabelFromSegment = (segment: string) => {
    if (IdentifiantProjet.estValide(decodeParameter(segment))) {
      return `${IdentifiantProjet.convertirEnValueType(decodeParameter(segment)).formatterMétier()}`;
    }
    return segment.replaceAll('-', ' ');
  };

  return (
    <Breadcrumb
      currentPageLabel={getLabelFromSegment(segmentsToDisplay.at(-1) ?? '')}
      homeLinkProps={{
        href: '/',
      }}
      segments={segmentsToDisplay.slice(0, -1).map((segment, index) => ({
        label: getLabelFromSegment(segment),
        linkProps: {
          href: `/${segmentsToDisplay
            .slice(0, -1)
            .slice(0, index + 1)
            .join('/')}`,
        },
      }))}
    />
  );
}
