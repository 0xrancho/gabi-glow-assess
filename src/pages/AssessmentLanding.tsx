import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle, Clock, Shield } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import heroBackground from "@/assets/hero-background.jpg";

const AssessmentLanding = () => {
  
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    subscribeUpdates: true,
    captcha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate simple math CAPTCHA
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const captchaAnswer = num1 + num2;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.captcha || parseInt(formData.captcha) !== captchaAnswer) {
      newErrors.captcha = "Please solve the math problem correctly";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Generate session ID and store initial data
    const sessionId = uuidv4();
    const assessmentData = {
      sessionId,
      ...formData,
      startedAt: new Date().toISOString(),
    };

    // Store in localStorage for session persistence
    localStorage.setItem('assessment_session', JSON.stringify(assessmentData));
    
    // Simulate loading for UX
    setTimeout(() => {
      window.location.href = '/assessment/step/1';
    }, 1500);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormValid = formData.fullName && formData.company && formData.email && formData.captcha;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Additional overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gabi-purple/10 via-transparent to-gabi-pink/10" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 gabi-gradient rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-user-accent/20 rounded-full blur-3xl opacity-30" />

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-gabi-purple animate-glow-pulse" />
            <h1 className="text-5xl font-bold">
              AI Transformation <span className="gabi-text">Assessment</span>
            </h1>
          </div>
          
          <div className="mb-4">
            <p className="text-xl text-text-secondary mb-2">Powered by GABI</p>
            <p className="text-2xl text-text-primary font-medium">
              Get your personalized AI roadmap in 15 minutes
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-5 h-5 text-user-accent" />
              <span>15-minute strategic consultation</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Personalized AI implementation roadmap</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <Shield className="w-5 h-5 text-gabi-pink" />
              <span>No spam, just insights</span>
            </div>
          </div>
        </div>

        {/* Entry Form */}
        <Card className="glass-card max-w-md mx-auto">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-text-primary font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="input-field"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-error text-sm">{errors.fullName}</p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-text-primary font-medium">
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="input-field"
                  placeholder="Enter your company name"
                />
                {errors.company && (
                  <p className="text-error text-sm">{errors.company}</p>
                )}
              </div>

              {/* Business Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-primary font-medium">
                  Business Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input-field"
                  placeholder="your.email@company.com"
                />
                {errors.email && (
                  <p className="text-error text-sm">{errors.email}</p>
                )}
              </div>

              {/* CAPTCHA */}
              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-text-primary font-medium">
                  What's {num1} + {num2}? *
                </Label>
                <Input
                  id="captcha"
                  type="number"
                  value={formData.captcha}
                  onChange={(e) => handleInputChange('captcha', e.target.value)}
                  className="input-field"
                  placeholder="Enter the answer"
                />
                {errors.captcha && (
                  <p className="text-error text-sm">{errors.captcha}</p>
                )}
              </div>

              {/* Newsletter Subscription */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subscribe"
                  checked={formData.subscribeUpdates}
                  onCheckedChange={(checked) => 
                    handleInputChange('subscribeUpdates', checked === true)
                  }
                  className="border-interactive-border"
                />
                <Label htmlFor="subscribe" className="text-text-secondary text-sm leading-relaxed">
                  Subscribe to GABI Revenue Intelligence updates
                </Label>
              </div>

              {/* Launch Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`btn-gabi w-full text-lg py-6 ${
                  !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                } ${isLoading ? 'animate-pulse' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Launching Assessment...
                  </>
                ) : (
                  <>
                    Launch Assessment
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentLanding;