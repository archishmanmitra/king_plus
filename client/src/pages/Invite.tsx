import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const InvitePage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/invitations/${token}`);
        if (!res.ok) throw new Error("Invalid or expired invitation");
        const data = await res.json();
        setEmail(data.email);
        setRole(data.role);
      } catch (e: any) {
        toast({
          title: "Invitation error",
          description: e?.message || "Invalid link",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  const onSubmit = async () => {
    if (!password || password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({
        title: "Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to accept invitation");
      }
      toast({
        title: "Success",
        description: "Account created. You can sign in now.",
      });
      window.location.href = "/";
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) return null;

  return (
    <div className="container mx-auto max-w-lg p-4 md:p-8">
      <Card className="shadow-lg border-border/60">
        <CardHeader>
          <CardTitle>Complete Your Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} readOnly className="bg-muted/40" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={role} readOnly className="bg-muted/40" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pwd">Password</Label>
              <Input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvitePage;
