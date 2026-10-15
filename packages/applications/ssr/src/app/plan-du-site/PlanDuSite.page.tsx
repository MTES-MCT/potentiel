import type { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation';
import Link from 'next/link';

import { Heading1 } from '@/components/atoms/headings';
import { footerLinks } from '@/components/organisms/Footer';
import { PageTemplate } from '@/components/templates/Page.template';

type PlanDuSitePageProps = {
  mainNavigation: MainNavigationProps;
};

export const PlanDuSitePage = ({ mainNavigation }: PlanDuSitePageProps) => {
  return (
    <PageTemplate banner={<Heading1>Plan du site</Heading1>}>
      <div className="flex flex-col gap-4">
        {mainNavigation.items.map((navItem) => (
          <div key={navItem.text?.toString()}>
            <div className="mb-2 font-semibold">
              {navItem.linkProps?.href ? (
                <Link href={navItem.linkProps.href}>{navItem.text}</Link>
              ) : (
                navItem.text
              )}
            </div>
            <ul className="list-disc pl-5">
              {navItem.menuLinks?.map((subItem) => (
                <li key={subItem.text?.toString()}>
                  <Link href={subItem.linkProps.href}>{subItem.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          {footerLinks.map((footerItem) => (
            <div key={footerItem.text}>
              <div className="mb-2 font-semibold">
                <Link href={footerItem.linkProps.href}>{footerItem.text}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
};
