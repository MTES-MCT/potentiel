import { redirect } from 'next/navigation';

import { applySearchParams } from '@/app/_helpers';

import { IdentifiantParameter } from './identifiantParameter';

export const redirectAvecSearchParams = (url: string, searchParams: Record<string, string>) =>
  redirect(applySearchParams(url, searchParams));

export type PageDeRedirectionProps = IdentifiantParameter & {
  searchParams: Promise<Record<string, string>>;
};
