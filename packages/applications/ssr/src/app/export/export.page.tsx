'use client';

import { FC, useState } from 'react';
import { Card } from '@codegouvfr/react-dsfr/Card';
import Notice from '@codegouvfr/react-dsfr/Notice';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { PageTemplate } from '@/components/templates/Page.template';
import { Heading1 } from '@/components/atoms/headings';
import { ListFilters, ListFiltersProps } from '@/components/molecules/ListFilters';
import { FiltersTagList } from '@/components/molecules/FiltersTagList';
import { Spinner } from '@/components/atoms/Spinner';

export type ExportPageProps = {
  actions: Array<{
    type:
      | 'exporter-raccordement'
      | 'exporter-fournisseur'
      | 'lister-lauréat-enrichi'
      | 'lister-éliminé-enrichi';
    label: string;
    url: string;
    description?: string;
    availableFilters: Array<string>;
  }>;
  filters: ListFiltersProps['filters'];
};

export const ExportPage: FC<ExportPageProps> = ({ actions, filters }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [modal] = useState(
    createModal({
      id: `action-modal-export-page`,
      isOpenedByDefault: false,
    }),
  );

  const downloadFile = async (fileUrl: string) => {
    setError(undefined);
    setIsLoading(true);

    modal.open();

    const response = await fetch(fileUrl);

    if (!response.ok) {
      setError('Erreur lors de la génération du fichier');
      modal.close();
      return;
    }

    const blob = await response.blob();
    const urlObject = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObject;
    a.download = getFileName(response.headers.get('content-disposition'));
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlObject);

    setIsLoading(false);
    modal.close();
  };

  return (
    <PageTemplate banner={<Heading1>Exporter des données</Heading1>}>
      <div className="flex flex-col md:flex-row gap-5 md:gap-10">
        <div className="flex flex-col gap-3 pb-2 md:w-1/4">
          <ListFilters filters={filters} />
        </div>

        <div>
          {error && <Notice iconDisplayed severity="alert" title={error} />}

          <ul className={'md:w-3/4 flex flex-col gap-3 flex-grow mt-8'}>
            {actions.map(({ type, label, url, description, availableFilters }) => (
              <li key={type}>
                <Card
                  border
                  size="small"
                  endDetail={
                    <span className="block w-full text-right">Format du fichier : csv</span>
                  }
                  linkProps={
                    isLoading
                      ? undefined
                      : {
                          href: '#',
                          onClick: async (e) => {
                            e.preventDefault();
                            await downloadFile(url);
                            return false;
                          },
                        }
                  }
                  end={
                    <FiltersTagList
                      filters={filters.filter((filter) =>
                        availableFilters.includes(filter.searchParamKey),
                      )}
                    />
                  }
                  title={label}
                  desc={description}
                />
              </li>
            ))}
          </ul>
        </div>
        <modal.Component title="Génération du fichier en cours" concealingBackdrop={false}>
          <div className="flex flex-col items-center mt-5 gap-5">
            <Spinner size="large" />
            <div>Cette action peut prendre quelques instants...</div>
          </div>
        </modal.Component>
      </div>
    </PageTemplate>
  );
};

/**
 * @description Extrait le nom du fichier à partir de l'en-tête "content-disposition" de la réponse HTTP. Si le nom du fichier ne peut pas être extrait, retourne un nom générique "export.csv".
 * @param headerValue string
 */
const getFileName = (headerValue: string | null) => {
  if (!headerValue) return 'export.csv';

  const contentDisposition = headerValue;
  const match = contentDisposition.match(/filename="?([^"]+)"?/);
  const fileName = match && match[1] ? match[1] : 'export.csv';

  return fileName;
};
