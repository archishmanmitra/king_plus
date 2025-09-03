import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-white">
      {/* Left panel: form */}
      <div className="relative flex min-h-screen flex-col">
        {/* Logo pinned to top-left */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="flex items-center gap-2 select-none">
            <div className="h-20 w-20 rounded-md bg-utech flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-extrabold">
                 <img src="/kinglogo.svg" height={80} width={80} className=' rounded-sm invert'/>
              </span>
            </div>
            <span className="text-xl font-semibold text-slate-800">KIN-G +</span>
          </div>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex items-center p-8 md:p-12 lg:p-16 pt-0 mt-[-8px] md:-mt-6">
         <div className="mx-auto w-full max-w-5xl md:max-w-xl">
            <h1 className="text-[28px] leading-tight font-semibold text-slate-800">Welcome to KIN-G +</h1>
            <p className="mt-1 text-[18px] text-slate-600">Sign into your account</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Phone or Email address</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Phone or Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-md border-slate-200 placeholder:text-slate-400 focus:ring-utech focus-visible:ring-utech focus:border-utech/60"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-md border-slate-200 placeholder:text-slate-400 focus:ring-utech focus-visible:ring-utech focus:border-utech/60"
                  required
                />
              </div>
              <Button type="submit" className="h-10 w-36 rounded-xl bg-utech text-white hover:bg-utech/90 shadow-sm" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Log In'}
              </Button>
              <div className="mt-1 text-left">
                <a href="#" className="text-utech hover:underline text-sm">Forgot password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right panel: illustration */}
      <div className="hidden md:block relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(135deg, hsl(var(--brand-start)) 0%, hsl(var(--brand-mid)) 45%, hsl(var(--brand-end)) 100%)',
          }}
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F64059551b35e4be785fd72505a672da7%2Fde851a52d56545b0be8f99551b3358ce?format=webp&width=1600"
          alt="Technology illustration"
          className="absolute inset-0 h-full w-full object-cover object-right mix-blend-overlay"
        />
      </div>
    </div>
  );
};

export default LoginForm;
