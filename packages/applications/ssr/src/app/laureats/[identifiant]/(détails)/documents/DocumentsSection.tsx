'use client';

import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Heading2 } from '@/components/atoms/headings';

import { ColumnPageTemplate } from '../../../../../components/templates/ColumnPage.template';

// l'onglet pour ses documents
// retrouver les documents à télécharger
// alertes sur les documents manquants ?

export const DocumentsSection = () => (
  <ColumnPageTemplate
    heading={<Heading2>Mes documents</Heading2>}
    leftColumn={{
      children: (
        <Alert
          severity="info"
          title="Raccordement"
          description={
            <span>Vous devez transmettre votre Preuve de transmission au cocontractant</span>
          }
        />
      ),
    }}
    // peut être donner des informations sur les documents ?
    rightColumn={{
      children: (
        <ButtonsGroup
          buttonsSize="medium"
          buttonsEquisized
          alignment="center"
          inlineLayoutWhen="always"
          className="flex flex-col gap-1"
          buttons={[
            {
              children: "Télécharger l'attestation",
              priority: 'primary',
              onClick: () => window.print(),
            },
            {
              children: 'Document GFs',
              priority: 'primary',
              onClick: () => window.print(),
            },
            {
              children: 'Télécharger ma DCR',
              priority: 'primary',
              onClick: () => window.print(),
            },
          ]}
        />
      ),
    }}
  />
);
