import { AlertDialog } from "radix-ui";
import { Button } from "../../../components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Destructive confirmation (§7.13) on Radix AlertDialog: «Cancelar» gets the
// initial focus, Escape cancels, and focus returns to the trigger.
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !next && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-30 bg-scrim" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-40 w-[calc(100%-36px)] max-w-[444px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-[18px] text-text shadow-2">
          <AlertDialog.Title className="m-0 mb-2 text-title font-extrabold">{title}</AlertDialog.Title>
          <AlertDialog.Description className="m-0 mb-4 text-body">{description}</AlertDialog.Description>
          <div className="flex flex-wrap justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Cancelar</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="primary" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
