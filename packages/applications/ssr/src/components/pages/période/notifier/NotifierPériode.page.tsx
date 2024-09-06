import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { ListPageTemplate } from '@/components/templates/ListPage.template';
import { Tile } from '@/components/organisms/Tile';
import { Icon } from '@/components/atoms/Icon';

export type NotifierPériodePageProps = {
  périodes: Array<PériodeListItemProps>;
};

export const NotifierPériodePage: FC<NotifierPériodePageProps> = ({ périodes }) => {
  return périodes.length === 1 ? (
    <PageTemplate banner={<Heading1 className="text-theme-white">Notifier une période</Heading1>}>
      <Tile className="flex flex-col md:flex-row md:justify-between">
        <PériodeListItem {...périodes[0]} />
      </Tile>
      {/* <NotifierPériodeForm périodes={périodes} /> */}
    </PageTemplate>
  ) : (
    <ListPageTemplate
      heading="Périodes"
      actions={[]}
      currentPage={1}
      itemsPerPage={10}
      totalItems={99}
      filters={[]}
      ItemComponent={PériodeListItem}
      items={périodes.map((période) => ({
        ...période,
        key: `${période.appelOffre}#${période.période}`,
      }))}
    ></ListPageTemplate>
  );
};

type PériodeListItemProps = {
  appelOffre: string;
  période: string;
};

const PériodeListItem: FC<PériodeListItemProps> = ({ appelOffre, période }) => (
  <div className="flex flex-1 flex-col gap-6">
    <div className="flex items-center">
      <h2 className="leading-5">
        Période <span className="font-bold">{période}</span> de l'appel d'offres{' '}
        <span className="font-bold">{appelOffre}</span>
      </h2>

      <Button
        className="hidden md:flex ml-auto"
        linkProps={{
          href: '',
        }}
        aria-label={``}
      >
        Notifier
      </Button>
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex md:flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <Icon id="fr-icon-calendar-line" title="Notifié le" size="sm" />
          <span className="italic">Notifiée le {DateTime.now().date.toLocaleDateString()}</span>
        </div>

        <div className="flex  items-center gap-2">
          <Icon id="fr-icon-account-line" title="Notifié par" size="sm" />
          Par Le Validateur !
        </div>
      </div>

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="ri-close-circle-fill"
            className="text-dsfr-redMarianne-main472-default"
            title="Total des éliminés"
          />
          <div className="lg:flex lg:flex-col items-center">12 éliminés</div>
        </div>
      </div>

      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon
            id="ri-check-line"
            className="text-dsfr-greenEmeraude-main632-default"
            title="Total des classés"
          />
          <div className="lg:flex lg:flex-col items-center">57 lauréats</div>
        </div>
      </div>
      <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4 text-sm">
        <div className="flex lg:flex-1 lg:flex-col items-center gap-2">
          <Icon id="ri-functions" title="Total des candidatures" />
          <div className="lg:flex lg:flex-col items-center">69 candidatures</div>
        </div>
      </div>
    </div>

    <div className="flex md:hidden">
      <Button
        linkProps={{
          href: '',
        }}
        aria-label={``}
      >
        Notifier
      </Button>
    </div>
  </div>
);
