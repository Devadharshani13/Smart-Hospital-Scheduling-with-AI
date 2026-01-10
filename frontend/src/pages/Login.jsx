import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, User as UserIcon, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { authAPI } from '../api';
import { saveToken, decodeToken } from '../auth';
import { toast } from 'sonner';

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(loginData);
      saveToken(response.data.token);
      const user = decodeToken(response.data.token);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      switch (user.role) {
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.register(registerData);
      saveToken(response.data.token);
      const user = decodeToken(response.data.token);
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      switch (user.role) {
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="hidden lg:block space-y-6 animate-slide-in">
          <div className="flex items-center gap-3">
            <Activity className="w-12 h-12 text-[hsl(205,70%,40%)]" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">MedFlow</h1>
              <p className="text-muted-foreground">AI-Powered OPD Prediction</p>
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Smart Hospital Scheduling with AI
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Predict OPD loads, optimize visiting times, and receive AI-powered recommendations
            for better healthcare experiences.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 glass-card p-4 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[hsl(205,70%,40%)]/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[hsl(205,70%,40%)]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Predictions</h3>
                <p className="text-sm text-muted-foreground">Real-time OPD load forecasting</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 glass-card p-4 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[hsl(190,60%,40%)]/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[hsl(190,60%,40%)]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">Optimized visiting time recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="glass-card border-white/30 shadow-lg animate-slide-in">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 lg:hidden mb-4">
              <Activity className="w-8 h-8 text-[hsl(205,70%,40%)]" />
              <CardTitle className="text-2xl">MedFlow</CardTitle>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-[hsl(205,70%,40%)] hover:bg-[hsl(205,75%,35%)] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <select
                      id="register-role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={registerData.role}
                      onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-[hsl(190,60%,40%)] hover:bg-[hsl(190,65%,35%)] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
