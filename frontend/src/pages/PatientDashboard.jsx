import React, { useState } from 'react';
import { AlertCircle, Brain, Calendar, Clock, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import Layout from '../Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { patientAPI } from '../api';
import { getUserFromToken } from '../auth';
import { toast } from 'sonner';

const DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'Emergency',
  'General Medicine',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
];

export const PatientDashboard = () => {
  const user = getUserFromToken();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  
  const [formData, setFormData] = useState({
    age: '',
    department: 'General Medicine',
    symptoms: '',
  });

  const handleAnalysis = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const response = await patientAPI.predictOPD({
        age: parseInt(formData.age),
        department: formData.department,
        symptoms: formData.symptoms,
      });
      
      setPrediction(response.data);
      toast.success('AI analysis completed!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
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

  return (
    <Layout role="patient" userName={user?.name || 'Patient'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="glass-card p-6 rounded-xl border-white/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[hsl(205,70%,40%)]/10 flex items-center justify-center pulse-glow flex-shrink-0">
              <Brain className="w-6 h-6 text-[hsl(205,70%,40%)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">AI-Powered OPD Prediction</h2>
              <p className="text-muted-foreground">
                Enter your details below to get real-time OPD load predictions and personalized visiting time recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[hsl(205,70%,40%)]" />
                Patient Information
              </CardTitle>
              <CardDescription>Provide your details for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalysis} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <select
                    id="department"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms in detail..."
                    className="min-h-[120px]"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[hsl(205,70%,40%)] hover:bg-[hsl(205,75%,35%)] text-white"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="mr-2 w-4 h-4 animate-pulse" />
                      AI is analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 w-4 h-4" />
                      Run AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {prediction ? (
            <div className="space-y-6 animate-slide-in">
              {/* Risk Level */}
              <Card className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" style={{ color: getRiskColor(prediction.risk_level) }} />
                    OPD Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`px-4 py-2 text-lg font-semibold ${getRiskBadgeClass(prediction.risk_level)}`}>
                      {prediction.risk_level}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{prediction.predicted_load}</p>
                      <p className="text-sm text-muted-foreground">Predicted Patients</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Congestion Confidence</span>
                      <span className="font-semibold text-foreground">
                        {Math.round(prediction.congestion_confidence * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={prediction.congestion_confidence * 100} 
                      className="h-2"
                      style={{ 
                        '--progress-background': getRiskColor(prediction.risk_level)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Best Time */}
              <Card className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[hsl(190,60%,40%)]" />
                    Best Visiting Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-[hsl(190,50%,92%)] rounded-lg">
                    <Calendar className="w-8 h-8 text-[hsl(190,60%,40%)]" />
                    <div>
                      <p className="text-lg font-semibold text-foreground">{prediction.best_visiting_time}</p>
                      <p className="text-sm text-muted-foreground">Recommended time slot</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendation */}
              <Card className="glass-card border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[hsl(205,70%,40%)]" />
                    AI Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{prediction.recommendation}</p>
                </CardContent>
              </Card>

              {/* Nearby Hospitals */}
              {prediction.nearby_hospitals && prediction.nearby_hospitals.length > 0 && (
                <Card className="glass-card border-white/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[hsl(190,60%,40%)]" />
                      Nearby Hospitals
                    </CardTitle>
                    <CardDescription>AI-recommended hospitals based on your needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {prediction.nearby_hospitals.map((hospital, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border transition-all ${
                          hospital.ai_recommended
                            ? 'bg-[hsl(145,40%,95%)] border-[hsl(145,55%,42%)] shadow-sm'
                            : 'bg-white/50 border-white/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                              {hospital.ai_recommended && (
                                <Badge className="bg-[hsl(145,55%,42%)] text-white text-xs">
                                  AI Recommended
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {hospital.distance}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {hospital.estimated_wait}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-[hsl(205,70%,40%)]">
                              {hospital.rating}
                            </span>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="glass-card border-white/30 flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[hsl(205,70%,40%)]/10 flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-[hsl(205,70%,40%)]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ready for AI Analysis</h3>
                  <p className="text-muted-foreground max-w-md">
                    Fill in the patient information form and click "Run AI Analysis" to get your personalized OPD prediction.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;

