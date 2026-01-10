import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import Layout from '../layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { doctorAPI } from '../api';
import { getUserFromToken } from '../auth';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const DoctorDashboard = () => {
  const user = getUserFromToken();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await doctorAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'hsl(145, 55%, 42%)';
      case 'medium':
        return 'hsl(35, 90%, 52%)';
      case 'high':
        return 'hsl(4, 75%, 48%)';
      default:
        return 'hsl(35, 90%, 52%)';
    }
  };

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'risk-badge-low';
      case 'medium':
        return 'risk-badge-medium';
      case 'high':
        return 'risk-badge-high';
      default:
        return 'risk-badge-medium';
    }
  };

  const COLORS = ['hsl(205, 70%, 50%)', 'hsl(190, 60%, 45%)', 'hsl(145, 55%, 45%)', 'hsl(35, 80%, 55%)'];

  if (isLoading) {
    return (
      <Layout role="doctor" userName={user?.name || 'Doctor'}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Activity className="w-12 h-12 text-[hsl(205,70%,40%)] animate-pulse mx-auto" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="doctor" userName={user?.name || 'Doctor'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                OPD Risk Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={`px-3 py-1 ${getRiskBadgeClass(analytics?.opd_risk_level)}`}>
                  {analytics?.opd_risk_level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Patients Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{analytics?.patients_today || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Total consultations</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                High-Risk Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: 'hsl(4, 75%, 48%)' }}>
                {analytics?.high_risk_cases || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Common Symptom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-foreground line-clamp-2">
                {analytics?.most_common_symptom || 'No data'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Most frequent</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hourly Load Chart */}
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle>Hourly OPD Load</CardTitle>
              <CardDescription>Patient flow throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.hourly_load || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="patients" fill="hsl(205, 70%, 40%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Patient allocation by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.department_distribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(analytics?.department_distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution */}
        <Card className="glass-card border-white/30">
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Breakdown of patient risk categories today</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.risk_distribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" fill="hsl(190, 60%, 40%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="glass-card border-white/30 bg-gradient-to-br from-[hsl(205,70%,96%)] to-[hsl(190,60%,94%)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[hsl(205,70%,40%)]" />
              Today's Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[hsl(205,70%,40%)] mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Peak Hours:</span> OPD load is highest between 12 PM - 2 PM. Consider scheduling non-urgent cases during off-peak hours.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[hsl(190,60%,40%)] mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">High-Risk Alert:</span> {analytics?.high_risk_cases || 0} patients require immediate attention. Review cases marked with high priority.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[hsl(145,55%,42%)] mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Department Load:</span> {analytics?.department_distribution?.[0]?.name || 'General Medicine'} has the highest patient load today.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
