import { Dialog } from "@headlessui/react";
import React from "react";
import { XMarkSvg } from "./svg/XMarkSvg";

export const AppDialog = ({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidthClassName = "max-w-[500px]",
  bodyClassName = "flex-1 overflow-y-auto px-4 py-4 min-h-0",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      <Dialog.Panel
        className={`relative z-10 flex w-full ${maxWidthClassName} max-h-[90vh] flex-col overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800/95 text-slate-200 shadow-2xl`}
      >
        <Dialog.Title
          as="div"
          className="flex items-center justify-between border-b border-slate-700 px-4 py-3 shrink-0"
        >
          <h3 className="text-lg font-semibold">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <XMarkSvg />
          </button>
        </Dialog.Title>

        <div className={bodyClassName}>{children}</div>

        {footer ? (
          <div className="shrink-0 flex justify-end gap-3 border-t border-slate-700 px-4 py-3">
            {footer}
          </div>
        ) : null}
      </Dialog.Panel>
    </Dialog>
  );
};
