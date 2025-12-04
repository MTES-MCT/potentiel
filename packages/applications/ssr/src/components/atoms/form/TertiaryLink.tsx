import Link from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
};

export const TertiaryLink = ({ children, href }: Props) => (
  <Link className="w-fit text-sm text-dsfr-text-title-blueFrance-default font-medium" href={href}>
    {children}
  </Link>
);
