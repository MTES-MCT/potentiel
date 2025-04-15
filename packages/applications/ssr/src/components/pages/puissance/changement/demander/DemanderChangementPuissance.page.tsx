import { FC } from 'react';

import { CahierDesCharges, Puissance } from '@potentiel-domain/laureat';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { DemanderChangementPuissanceForm } from './DemanderChangementPuissance.form';

export type DemanderChangementPuissancePageProps = PlainType<
  Puissance.ConsulterPuissanceReadModel & {
    appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
    période: AppelOffre.Periode;
    technologie: Candidature.TypeTechnologie.RawType;
    famille?: AppelOffre.Famille;
    cahierDesCharges: PlainType<CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel>;
    note: number;
    unitéPuissance: string;
  }
>;

export const DemanderChangementPuissancePage: FC<DemanderChangementPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  appelOffre,
  période,
  technologie,
  famille,
  cahierDesCharges,
  note,
  unitéPuissance,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Demander un changement de puissance</Heading1>
    <DemanderChangementPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      appelOffre={appelOffre}
      période={période}
      technologie={technologie}
      famille={famille}
      cahierDesCharges={cahierDesCharges}
      note={note}
      unitéPuissance={unitéPuissance}
    />
  </PageTemplate>
);
