import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import Layout from '../layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { adminAPI } from '../api';
import { getUserFromToken } from '../auth';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const user = getUserFromToken();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout role="admin" userName={user?.name || 'Admin'}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Activity className="w-12 h-12 text-[hsl(205,70%,40%)] animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading system analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin" userName={user?.name || 'Admin'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Patients Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(205,70%,40%)]">
                {analytics?.total_patients_today || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">System-wide</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                High-Risk Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[hsl(4,75%,48%)]">
                {analytics?.high_risk_periods || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Critical timeframes</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Peak OPD Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">
                {analytics?.peak_opd_time || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Highest traffic</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-[hsl(145,55%,42%)] text-white">
                {analytics?.system_status || 'Operational'}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Accuracy: {((analytics?.prediction_accuracy || 0.87) * 100).toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI System Summary */}
        <Card className="glass-card border-white/30 bg-gradient-to-br from-[hsl(205,70%,96%)] to-[hsl(190,60%,94%)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[hsl(205,70%,40%)]" />
              AI System Summary
            </CardTitle>
            <CardDescription>Real-time insights from predictive analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white/70 rounded-lg">
              <p className="text-foreground leading-relaxed">{analytics?.ai_summary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[hsl(190,60%,40%)]" />
              Weekly Patient Trends
            </CardTitle>
            <CardDescription>7-day overview of OPD activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics?.weekly_trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(205, 70%, 40%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(205, 70%, 40%)', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Metrics Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="text-base">AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
                <span className="font-semibold text-[hsl(145,55%,42%)]">
                  {((analytics?.prediction_accuracy || 0.87) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Total Predictions</span>
                <span className="font-semibold text-foreground">{analytics?.total_patients_today || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Model Status</span>
                <Badge className="bg-[hsl(145,55%,42%)] text-white">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="text-base">Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">OPD Capacity</span>
                <span className="font-semibold text-foreground">78%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Staff Availability</span>
                <span className="font-semibold text-[hsl(145,55%,42%)]">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Wait Time Avg</span>
                <span className="font-semibold text-foreground">18 min</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">API Uptime</span>
                <span className="font-semibold text-[hsl(145,55%,42%)]">99.9%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="font-semibold text-foreground">120ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Error Rate</span>
                <span className="font-semibold text-[hsl(145,55%,42%)]">0.01%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[hsl(205,70%,40%)]" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Badge className="bg-[hsl(4,75%,48%)] text-white">High</Badge>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Allocate Additional Staff</p>
                <p className="text-sm text-muted-foreground">Peak load expected during {analytics?.peak_opd_time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Badge className="bg-[hsl(35,90%,52%)] text-white">Medium</Badge>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Review High-Risk Cases</p>
                <p className="text-sm text-muted-foreground">{analytics?.high_risk_periods} periods need monitoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <Badge className="bg-[hsl(145,55%,42%)] text-white">Low</Badge>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">System Performance Optimal</p>
                <p className="text-sm text-muted-foreground">Continue regular monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
