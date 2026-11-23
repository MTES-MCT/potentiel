import Badge from '@mui/material/Badge';
import type { ReactNode } from 'react';

type MenuItemLabelWithBadgeProps = {
  title: ReactNode;
  badgeContent: ReactNode;
  invisible?: boolean;
};
export const MenuItemLabelWithBadge = ({
  title,
  badgeContent,
  invisible,
}: MenuItemLabelWithBadgeProps) => (
  <div className="flex flex-row items-center gap-6">
    {title}
    <Badge badgeContent={badgeContent} color="primary" overlap="circular" invisible={invisible} />
  </div>
);
