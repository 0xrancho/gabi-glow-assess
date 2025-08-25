import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Step1BusinessType from "@/components/assessment/Step1BusinessType";
import Step2OpportunityFocus from "@/components/assessment/Step2OpportunityFocus";
import Step3RevenueModel from "@/components/assessment/Step3RevenueModel";
import Step4Challenges from "@/components/assessment/Step4Challenges";
import Step5TeamInvolved from "@/components/assessment/Step5TeamInvolved";
import Step6ProcessDescription from "@/components/assessment/Step6ProcessDescription";
import Step7TechStack from "@/components/assessment/Step7TechStack";
import Step8InvestmentLevel from "@/components/assessment/Step8InvestmentLevel";
import Step9AdditionalContext from "@/components/assessment/Step9AdditionalContext";
import Step10Generation from "@/components/assessment/Step10Generation";

interface AssessmentData {
  sessionId: string;
  fullName: string;
  company: string;
  email: string;
  subscribeUpdates: boolean;
  businessType?: string;
  opportunityFocus?: string;
  revenueModel?: string;
  challenges?: string[];
  metrics?: Record<string, any>;
  metricsQuantified?: Record<string, string>;
  teamDescription?: string;
  processDescription?: string;
  techStack?: string[];
  investmentLevel?: string;
  additionalContext?: string;
  [key: string]: any;
}

const AssessmentStep = () => {
  const { stepNumber } = useParams<{ stepNumber: string }>();
  const navigate = useNavigate();
  const currentStep = parseInt(stepNumber || "1");
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load assessment session data
    const sessionData = localStorage.getItem('assessment_session');
    if (!sessionData) {
      navigate('/assessment');
      return;
    }

    try {
      const data = JSON.parse(sessionData);
      setAssessmentData(data);
    } catch (error) {
      console.error('Error parsing assessment data:', error);
      navigate('/assessment');
      return;
    }

    setIsLoading(false);
  }, [navigate]);

  const updateAssessmentData = (updates: Partial<AssessmentData>) => {
    if (!assessmentData) return;

    const updatedData = { ...assessmentData, ...updates };
    setAssessmentData(updatedData);
    
    // Save to localStorage
    localStorage.setItem('assessment_session', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    if (currentStep < 10) {
      navigate(`/assessment/step/${currentStep + 1}`);
    } else {
      navigate('/assessment/report');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/assessment/step/${currentStep - 1}`);
    } else {
      navigate('/assessment');
    }
  };

  const getStepComponent = () => {
    if (!assessmentData) return null;

    const commonProps = {
      data: assessmentData,
      updateData: updateAssessmentData,
      onNext: handleNext,
    };

    switch (currentStep) {
      case 1:
        return <Step1BusinessType {...commonProps} />;
      case 2:
        return <Step2OpportunityFocus {...commonProps} />;
      case 3:
        return <Step3RevenueModel {...commonProps} />;
      case 4:
        return <Step4Challenges {...commonProps} />;
      case 5:
        return <Step5TeamInvolved {...commonProps} />;
      case 6:
        return <Step6ProcessDescription {...commonProps} />;
      case 7:
        return <Step7TechStack {...commonProps} />;
      case 8:
        return <Step8InvestmentLevel {...commonProps} />;
      case 9:
        return <Step9AdditionalContext {...commonProps} />;
      case 10:
        return <Step10Generation {...commonProps} />;
      default:
        return <div>Step not found</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gabi-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  const progressPercentage = (currentStep / 10) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-interactive-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-text-muted">Step {currentStep} of 10</p>
              <p className="text-xs text-text-secondary font-mono">
                {assessmentData.company} Assessment
              </p>
            </div>

            <div className="w-16" /> {/* Spacer for centering */}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i + 1}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-300 ${
                  i + 1 < currentStep
                    ? 'bg-success text-white'
                    : i + 1 === currentStep
                    ? 'bg-user-accent text-white animate-glow-pulse'
                    : 'bg-interactive-bg text-text-muted'
                }`}
              >
                {i + 1 < currentStep ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card animate-fade-in">
            <CardContent className="p-8">
              {getStepComponent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStep;