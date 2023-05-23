import React, { ReactNode } from 'react';

export const Dialog = ({ open, children }: { open: boolean; children: ReactNode }) => (
  <dialog
    open={open}
    className={`${
      open ? 'flex' : 'hidden'
    } z-50 absolute left-0 top-0 w-full h-screen border-none bg-grey-425-base bg-opacity-70`}
  >
    <div className="absolute bottom-0 md:relative md:m-auto p-8 pt-20 w-full md:w-2/5 h-1/2 md:h-2/5 bg-white">
      {children}
    </div>
  </dialog>
);
