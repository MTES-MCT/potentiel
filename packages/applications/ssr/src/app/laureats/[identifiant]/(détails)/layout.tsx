'use client';
import Tabs, { TabsProps } from '@codegouvfr/react-dsfr/Tabs';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { decodeParameter } from '@/utils/decodeParameter';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

const tabs: TabsProps.Controlled['tabs'] = [
  { label: "Vue d'ensemble", tabId: '', iconId: 'ri-dashboard-line' },
  {
    label: 'Informations Générales',
    tabId: 'informations-generales',
    iconId: 'ri-focus-line',
  },
  { label: 'Administratif', tabId: 'administratif', iconId: 'ri-focus-line' },
  { label: 'Installation', tabId: 'installation', iconId: 'ri-home-line' },
  { label: 'Évaluation Carbone', tabId: 'evaluation-carbone', iconId: 'ri-building-3-line' },
  { label: 'Documents', tabId: 'documents', iconId: 'ri-file-line' },
];

const tabsIds = tabs.map((tab) => tab.tabId);

export default function LauréatDétailsLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const router = useRouter();
  const pathname = usePathname();
  const getTabIdFromPath = () => {
    const pathParts = pathname.split('/');
    return pathParts.length > 3 && tabsIds.includes(pathParts[3]) ? pathParts[3] : '';
  };
  const [selectedTabId, setSelectedTabId] = useState(getTabIdFromPath());

  useEffect(() => {
    router.push(`/laureats/${encodeURIComponent(identifiantProjet)}/${selectedTabId}`);
  }, [selectedTabId]);

  return (
    <Tabs selectedTabId={selectedTabId} tabs={tabs} onTabChange={setSelectedTabId}>
      {children}
    </Tabs>
  );
}
