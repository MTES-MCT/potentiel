'use client';

import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';
import { useFeatures } from '@/utils/feature-flag/FeatureFlagContext';

export default function Page() {
  const features = useFeatures();

  return (
    <PageTemplate
      feature="features"
      banner={<Heading1 className="text-theme-white">Liste des fonctionnalités activées</Heading1>}
    >
      <ul>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </PageTemplate>
  );
}
