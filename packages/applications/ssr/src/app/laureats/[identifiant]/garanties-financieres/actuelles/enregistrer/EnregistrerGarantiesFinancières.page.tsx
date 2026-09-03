import type { FC } from 'react';

<<<<<<< Updated upstream:packages/applications/ssr/src/app/laureats/[identifiant]/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
import { Heading1 } from '@/components/atoms/headings';
=======
import { SectionPage } from '@/components/atoms/section/SectionPage';
>>>>>>> Stashed changes:packages/applications/ssr/src/app/laureats/[identifiant]/(détails)/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
import {
  SoumettreDépôtGarantiesFinancièresForm,
  type SoumettreDépôtGarantiesFinancièresFormProps,
} from '../../depot/soumettre/SoumettreDépôtGarantiesFinancières.form';
import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresPageProps = Pick<
  SoumettreDépôtGarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
>;

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
<<<<<<< Updated upstream:packages/applications/ssr/src/app/laureats/[identifiant]/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
  <>
    <Heading1>Enregistrer des garanties financières</Heading1>

=======
  <SectionPage title="Enregistrer des garanties financières">
>>>>>>> Stashed changes:packages/applications/ssr/src/app/laureats/[identifiant]/(détails)/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
<<<<<<< Updated upstream:packages/applications/ssr/src/app/laureats/[identifiant]/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
  </>
=======
  </SectionPage>
>>>>>>> Stashed changes:packages/applications/ssr/src/app/laureats/[identifiant]/(détails)/garanties-financieres/actuelles/enregistrer/EnregistrerGarantiesFinancières.page.tsx
);
