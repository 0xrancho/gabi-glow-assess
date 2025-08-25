import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Calendar,
  DollarSign,
  ArrowRight,
  Star,
  Download,
  Phone,
  CreditCard,
  Sparkles
} from "lucide-react";

interface AssessmentData {
  sessionId: string;
  fullName: string;
  company: string;
  email: string;
  businessType?: string;
  opportunityFocus?: string;
  revenueModel?: string;
  challenges?: string[];
  teamDescription?: string;
  processDescription?: string;
  techStack?: string[];
  investmentLevel?: string;
  additionalContext?: string;
}

const AssessmentReport = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Load assessment data
    const sessionData = localStorage.getItem('assessment_session');
    if (!sessionData) {
      navigate('/assessment');
      return;
    }

    try {
      const data = JSON.parse(sessionData);
      setAssessmentData(data);

      // Show feedback modal after 10 seconds
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 10000);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error parsing assessment data:', error);
      navigate('/assessment');
    }
  }, [navigate]);

  const handleFeedbackSubmit = () => {
    // Store feedback (in real app, send to backend)
    console.log('Feedback:', { rating, feedback });
    setShowFeedback(false);
  };

  const handleCTAClick = (action: string) => {
    // Track conversion (in real app, send to backend)
    console.log('CTA clicked:', action);
    
    // Generate Calendly URL with session ID
    const calendlyUrl = `https://calendly.com/example?session_id=${assessmentData?.sessionId}`;
    
    switch (action) {
      case 'free_call':
        window.open(calendlyUrl, '_blank');
        break;
      case 'paid_consult':
        // Redirect to Stripe checkout, then Calendly
        window.open('https://checkout.stripe.com/example-consultation', '_blank');
        break;
      case 'gabi_signup':
        // Redirect to Stripe checkout, then Calendly
        window.open('https://checkout.stripe.com/example-gabi', '_blank');
        break;
    }
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gabi-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading your report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-gabi-purple/10 to-gabi-pink/10 border-b border-interactive-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                AI Transformation Assessment Report
              </h1>
              <p className="text-text-secondary">
                Prepared for <span className="text-user-accent font-medium">{assessmentData.fullName}</span> at{" "}
                <span className="text-user-accent font-medium">{assessmentData.company}</span>
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Report Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Executive Summary',
                  'Current State Analysis', 
                  'AI Opportunities',
                  'Recommended Solutions',
                  'Implementation Roadmap',
                  'ROI Projections',
                  'Next Steps'
                ].map((section) => (
                  <button
                    key={section}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors"
                  >
                    {section}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Executive Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gabi-purple" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="text-2xl font-bold text-success mb-1">High</div>
                    <div className="text-sm text-text-secondary">AI Readiness</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
                    <div className="text-2xl font-bold text-warning mb-1">$50K+</div>
                    <div className="text-sm text-text-secondary">Potential Annual Savings</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gabi-purple/10 border border-gabi-purple/20">
                    <div className="text-2xl font-bold text-gabi-purple mb-1">6 Months</div>
                    <div className="text-sm text-text-secondary">Implementation Timeline</div>
                  </div>
                </div>
                
                <p className="text-text-secondary leading-relaxed">
                  Based on your assessment, <span className="text-user-accent font-medium">{assessmentData.company}</span> shows 
                  strong potential for AI transformation in <span className="text-user-accent">{assessmentData.opportunityFocus}</span>. 
                  Your current {assessmentData.businessType} operations present multiple automation opportunities that could 
                  significantly improve efficiency and reduce manual overhead.
                </p>
              </CardContent>
            </Card>

            {/* Current State Analysis */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-user-accent" />
                  Current State Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Business Focus</h4>
                  <Badge variant="secondary" className="mb-2">{assessmentData.businessType}</Badge>
                  <p className="text-text-secondary text-sm">
                    Primary opportunity area: {assessmentData.opportunityFocus}
                  </p>
                </div>

                {assessmentData.challenges && (
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Key Challenges</h4>
                    <div className="space-y-2">
                      {assessmentData.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-error mt-2 flex-shrink-0" />
                          <span className="text-text-secondary text-sm">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {assessmentData.techStack && (
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Current Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessmentData.techStack.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Transformation Opportunities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-gabi-pink" />
                  AI Transformation Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-interactive-border">
                    <h4 className="font-medium text-text-primary mb-2">Process Automation</h4>
                    <p className="text-text-secondary text-sm">
                      Automate repetitive tasks in your {assessmentData.opportunityFocus} workflow
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-interactive-border">
                    <h4 className="font-medium text-text-primary mb-2">Intelligent Analytics</h4>
                    <p className="text-text-secondary text-sm">
                      AI-powered insights for better decision making
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-interactive-border">
                    <h4 className="font-medium text-text-primary mb-2">Customer Experience</h4>
                    <p className="text-text-secondary text-sm">
                      Enhanced client interactions through AI assistance
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-interactive-border">
                    <h4 className="font-medium text-text-primary mb-2">Predictive Modeling</h4>
                    <p className="text-text-secondary text-sm">
                      Forecast outcomes and optimize resource allocation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Roadmap */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-success" />
                  Implementation Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { phase: "Discovery & Planning", duration: "Weeks 1-2", items: ["Detailed process analysis", "Technology assessment", "ROI modeling"] },
                    { phase: "Pilot Implementation", duration: "Weeks 3-8", items: ["MVP development", "Team training", "Initial testing"] },
                    { phase: "Scale & Optimize", duration: "Weeks 9-16", items: ["Full deployment", "Performance monitoring", "Continuous improvement"] }
                  ].map((phase, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-user-accent flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        {index < 2 && <div className="w-px h-16 bg-interactive-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-text-primary">{phase.phase}</h4>
                          <Badge variant="outline" className="text-xs">{phase.duration}</Badge>
                        </div>
                        <ul className="space-y-1">
                          {phase.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-text-secondary text-sm flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-text-muted" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Ready to Transform?</h2>
            <p className="text-text-secondary">Choose your next step to accelerate your AI journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Strategy Call */}
            <Card className="selection-card text-center">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 mx-auto mb-4 text-success" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Implement this plan!
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Ready to transform? Let's discuss your roadmap
                </p>
                <Button 
                  onClick={() => handleCTAClick('free_call')}
                  className="btn-gabi w-full"
                >
                  Schedule Free Strategy Call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Paid Consultation */}
            <Card className="selection-card text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 mx-auto mb-4 text-warning" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Get personalized guidance
                </h3>
                <p className="text-text-secondary text-sm mb-2">
                  60 minutes of personalized AI consulting
                </p>
                <p className="text-user-accent font-semibold mb-4">
                  $100 - Includes detailed recommendations
                </p>
                <Button 
                  onClick={() => handleCTAClick('paid_consult')}
                  variant="outline"
                  className="w-full border-user-accent text-user-accent hover:bg-user-accent hover:text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </CardContent>
            </Card>

            {/* GABI Signup */}
            <Card className="selection-card text-center">
              <CardContent className="p-6">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gabi-purple" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Get GABI for your business
                </h3>
                <p className="text-text-secondary text-sm mb-2">
                  Deploy your own AI assessment like this one
                </p>
                <p className="text-gabi-purple font-semibold mb-4">
                  $300/month + Implementation call
                </p>
                <Button 
                  onClick={() => handleCTAClick('gabi_signup')}
                  className="btn-gabi w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start with GABI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="glass-card w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                <span className="gabi-text">GABI says:</span> How does this assessment land with you?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? 'text-warning' : 'text-text-muted'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional feedback..."
                className="input-field min-h-20 resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowFeedback(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleFeedbackSubmit}
                  className="btn-gabi flex-1"
                >
                  Thanks for the feedback!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AssessmentReport;