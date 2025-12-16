import Link from 'next/link';

type Props = {
  href: string;
  'aria-label'?: string;
  children: React.ReactNode;
};

export const TertiaryLink = ({ children, href, 'aria-label': ariaLabel }: Props) => (
  <Link
    className="w-fit text-sm text-dsfr-text-title-blueFrance-default font-medium"
    href={href}
    aria-label={ariaLabel}
  >
    {children}
  </Link>
);
