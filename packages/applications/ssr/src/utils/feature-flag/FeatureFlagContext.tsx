'use client';

import { createContext, useContext } from 'react';

export const FeatureFlagContext = createContext<Array<string>>([]);
export const useFeatures = () => useContext(FeatureFlagContext);
