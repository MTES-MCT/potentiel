'use client';

import { FC } from 'react';

import { useFeatures } from '@/utils/feature-flag/FeatureFlagContext';

type FeatureFlaggedComponent = {
  feature: string;
  children: React.ReactNode;
  offRender?: React.ReactNode;
  isOff?: () => void;
};

export const FeatureFlaggedComponent: FC<FeatureFlaggedComponent> = ({
  feature,
  isOff,
  offRender = null,
  children,
}) => {
  const features = useFeatures();
  const isFeatureOn = features.includes(feature);

  if (!isFeatureOn) {
    isOff && isOff();
    return offRender;
  }

  return <div className="fr-container my-10">{children}</div>;
};
