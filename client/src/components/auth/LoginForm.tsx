import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Mail, Shield, Building2 } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left panel: Login Form */}
        <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg ring-4 ring-primary/10">
              <img src="/kinglogo.svg" height={40} width={40} className="rounded-lg invert" alt="KIN-G + Logo" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Welcome to{" "}
                <span className="bg-blue-600 bg-clip-text text-transparent">
                  KIN-G +
                </span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium mt-2">
                Your Premium Office Portal
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="w-full max-w-md card-premium animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold " 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span className='text-white'>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span className='text-white'>Sign In</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>

        {/* Right panel: Premium Illustration */}
        <div className="hidden lg:flex items-center justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="relative w-full h-[600px]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl" />
            
            {/* Main Illustration Container */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8 p-8">
              {/* Office Building Icon */}
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-2xl ring-8 ring-primary/10">
                <Building2 className="h-16 w-16 text-primary-foreground" />
              </div>
              
              {/* Enhanced Service Features */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-6">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-success to-success/80 flex items-center justify-center mb-3">
                    <Shield className="h-5 w-5 text-success-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">Advanced Security</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Multi-factor authentication, encrypted data transmission, and real-time threat monitoring</p>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-3">
                    <Lock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">Privacy Protection</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">GDPR compliant, zero-knowledge architecture, and complete data control</p>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">Smart Analytics</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">AI-powered insights, predictive reporting, and customizable dashboards</p>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">24/7 Support</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Dedicated support team, instant help desk, and comprehensive documentation</p>
                </div>
              </div>

              {/* Enrollment Section */}
              {/* <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20 shadow-lg">
                <div className="text-center">
                  <h3 className="font-bold text-foreground text-lg mb-2">Ready to Get Started?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Join thousands of businesses already using KIN-G +</p>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-primary-foreground font-semibold px-8 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div> */}
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 blur-xl" />
              <div className="absolute bottom-8 left-8 h-20 w-20 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
