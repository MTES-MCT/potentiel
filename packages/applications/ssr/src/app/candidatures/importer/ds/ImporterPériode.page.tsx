import Alert from '@codegouvfr/react-dsfr/Alert';
import Table from '@codegouvfr/react-dsfr/Table';
import Link from 'next/link';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import { ImporterPériodeForm, ImporterPériodeFormProps } from './ImporterPériode.form';

type ImporterPériodePageProps = {
  périodes: ImporterPériodeFormProps['périodes'];
};

export const ImporterPériodePage = ({ périodes }: ImporterPériodePageProps) => (
  <ColumnPageTemplate
    banner={<Heading1 className="text-theme-white">Importer des candidats</Heading1>}
    leftColumn={{ children: <ImporterPériodeForm périodes={périodes} /> }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <div className="flex flex-col gap-2">
              <p>
                Pour ce type d'import, les candidatures proviennent de{' '}
                <Link target="_blank" href="https://demarches.numerique.gouv.fr">
                  Démarches Simplifiées
                </Link>
                .
              </p>
              <p>
                Seul le fichier contenant le résultat de l'instruction de la CRE doit être transmis
                ici, au format CSV, avec les colonnes suivantes :
              </p>
              <Table
                className="lg:mx-4 my-4 border-spacing-0"
                headers={['Colonne', 'Format', 'Optionnel']}
                data={[
                  ['numeroDossierDS', 'chaîne de caractères', 'non'],
                  ['statut', 'classé ou éliminé', 'non'],
                  ['note', 'nombre', 'non'],
                  [
                    'motifElimination',
                    'chaîne de caractères',
                    'oui, sauf en cas de statut éliminé',
                  ],
                ]}
              />
              <p>
                Pour importer des candidats oubliés sur une période déjà notifiée, cliquer{' '}
                <Link href={`?reimport=true`}>ici</Link>
              </p>
            </div>
          }
        />
      ),
    }}
  />
);
