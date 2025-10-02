import type { ReactNode } from 'react';
import { useMediaQuery } from '../hooks/media-query';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from './ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  MediaQueryContext,
  useMediaQueryContext,
} from '../hooks/media-query-context';

export function Modal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  return (
    <MediaQueryContext value={isDesktop}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      )}
    </MediaQueryContext>
  );
}

export function ModalTrigger({
  children,
  asChild = false,
}: {
  children: ReactNode;
  asChild?: boolean;
}) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
  ) : (
    <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
  );
}

export function ModalContent({
  children,
  showCloseButton = true,
}: {
  children: ReactNode;
  showCloseButton?: boolean;
}) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogContent showCloseButton={showCloseButton}>{children}</DialogContent>
  ) : (
    <DrawerContent>{children}</DrawerContent>
  );
}

export function ModalClose({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogClose onClick={onClick} className={className}>
      {children}
    </DialogClose>
  ) : null;
}

export function ModalTitle({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogTitle>{children}</DialogTitle>
  ) : (
    <DrawerTitle>{children}</DrawerTitle>
  );
}

export function ModalDescription({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogDescription>{children}</DialogDescription>
  ) : (
    <DrawerDescription>{children}</DrawerDescription>
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogHeader>{children}</DialogHeader>
  ) : (
    <DrawerHeader>{children}</DrawerHeader>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const isDesktop = useMediaQueryContext();
  return isDesktop ? (
    <DialogFooter className={className}>{children}</DialogFooter>
  ) : (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  );
}
