import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClockOutFormData) => void;
  totalTime: string;
}

export interface ClockOutFormData {
  approverUserId: string;
}

export const ClockOutModal: React.FC<ClockOutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  totalTime,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClockOutFormData>({
    approverUserId: "",
  });
  const [users, setUsers] = React.useState<Array<{ id: string; name: string }>>(
    []
  );

  React.useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/users`, { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        const list = (json?.users || [])
          .map((u: any) => ({ id: u.id, name: u.name || u.email }))
          .filter((u: any) => u.id && u.name);
        if (!abort) setUsers(list);
      } catch {}
    })();
    return () => {
      abort = true;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.approverUserId) {
      toast({
        title: "Validation Error",
        description: "Please select an approver.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: "Clock Out Submitted",
      description: "Your clock out has been submitted successfully.",
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({ approverUserId: "" });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-xl bg-lightblue border border-border/60 rounded-2xl shadow-xl supports-[backdrop-filter]:backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-semibold text-foreground">
            Clock Out Submission
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground color-black">
            Submit your clock out details for approval
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Time Display */}
          <div className="p-4 md:p-5 rounded-xl bg-muted/30 border border-border/60">
            <div className="text-center">
              <div className="text-xs md:text-sm text-muted-foreground mb-1">
                Total Time Worked
              </div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-primary">
                {totalTime}
              </div>
            </div>
          </div>

          {/* Approval By */}
          <div className="space-y-2">
            <Label htmlFor="approvalBy" className="text-sm">
              To be approved by <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.approverUserId}
              onValueChange={(value) =>
                setFormData({ ...formData, approverUserId: value })
              }
              required
            >
              <SelectTrigger id="approvalBy" className="focus-premium">
                <SelectValue placeholder="Select approver" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
