import React, { ComponentProps } from 'react';

export const Dialog = ({ open, children }: ComponentProps<'dialog'>) => (
  <dialog
    open={open}
    className={`${
      open ? 'flex' : 'hidden'
    } z-50 fixed left-0 top-0 w-screen h-screen m-0 p-0 border-none bg-grey-425-base bg-opacity-70`}
  >
    <div className="fixed bottom-0 md:relative md:m-auto p-0 w-screen md:w-2/5 h-fit max-h-screen bg-white">
      <div className="px-4 md:px-8 py-14 md:py-16">{children}</div>
    </div>
  </dialog>
);
