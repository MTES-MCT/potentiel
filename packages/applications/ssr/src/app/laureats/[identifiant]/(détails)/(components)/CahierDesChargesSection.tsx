import Notice from '@codegouvfr/react-dsfr/Notice';
import Link from 'next/link';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { CahierDesChargesData } from '../_helpers/getCahierDesChargesData';

import { Section } from './Section';

export type CahierDesChargesSectionProps = CahierDesChargesData;

export const CahierDesChargesSection = ({ value, action }: CahierDesChargesSectionProps) =>
  value && (
    <Section title="Cahier des charges">
      <div>
        Instruction selon le cahier des charges{' '}
        {value.estInitial
          ? 'initial (en vigueur à la candidature)'
          : `${
              value.estAlternatif ? 'alternatif' : ''
            } modifié rétroactivement et publié le ${value.dateParution}`}
        {', '}
        <Link target="_blank" className="w-fit" href={value.cahierDesChargesURL}>
          voir le cahier des charges
        </Link>
      </div>
      {value.doitChoisirUnCahierDesChargesModificatif && (
        <Notice
          description="Votre cahier des charges actuel ne vous permet pas d'accéder aux fonctionnalités
       dématérialisées d'information au Préfet et de modification de votre projet (abandon...), vous devez d'abord choisir un cahier des charges"
          title="Modification de votre projet"
          severity="warning"
        />
      )}
      {action && <TertiaryLink href={action.url}> {action.label}</TertiaryLink>}
    </Section>
  );
