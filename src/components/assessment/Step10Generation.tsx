import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, TrendingUp, Target, Calendar } from "lucide-react";

interface Props {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
}

const loadingMessages = [
  { 
    text: "Analyzing your business model...", 
    icon: Brain,
    duration: 3000 
  },
  { 
    text: "Researching industry benchmarks...", 
    icon: TrendingUp,
    duration: 3000 
  },
  { 
    text: "Identifying AI opportunities...", 
    icon: Sparkles,
    duration: 3000 
  },
  { 
    text: "Building your roadmap...", 
    icon: Target,
    duration: 3000 
  },
  { 
    text: "Finalizing recommendations...", 
    icon: Calendar,
    duration: 2000 
  }
];

const Step10Generation = ({ data, updateData }: Props) => {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Mark assessment as completed
    updateData({ 
      completedAt: new Date().toISOString(),
      status: 'completed'
    });

    let messageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const showNextMessage = () => {
      if (currentMessageIndex < loadingMessages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
        setProgress(((currentMessageIndex + 2) / loadingMessages.length) * 100);
        
        const currentMessage = loadingMessages[currentMessageIndex + 1];
        messageTimer = setTimeout(showNextMessage, currentMessage.duration);
      } else {
        // All messages shown, redirect to report
        setTimeout(() => {
          navigate('/assessment/report');
        }, 1000);
      }
    };

    // Start the sequence
    const firstMessage = loadingMessages[0];
    setProgress((1 / loadingMessages.length) * 100);
    messageTimer = setTimeout(showNextMessage, firstMessage.duration);

    // Smooth progress updates
    const progressInterval = 100; // Update every 100ms
    progressTimer = setInterval(() => {
      setProgress(prev => {
        const targetProgress = ((currentMessageIndex + 1) / loadingMessages.length) * 100;
        const increment = (targetProgress - prev) * 0.02; // Smooth animation
        return Math.min(prev + increment, 100);
      });
    }, progressInterval);

    return () => {
      clearTimeout(messageTimer);
      clearInterval(progressTimer);
    };
  }, [currentMessageIndex, navigate, updateData]);

  const currentMessage = loadingMessages[currentMessageIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gabi-purple to-gabi-pink flex items-center justify-center animate-pulse">
            <Icon className="w-12 h-12 text-white" style={{ animation: 'spin 3s linear infinite' }} />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gabi-purple to-gabi-pink opacity-20 animate-ping" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="progress-bar">
            <div 
              className="progress-fill transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm text-text-muted">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-text-primary animate-fade-in">
            {currentMessage.text}
          </h3>
          
          <p className="text-text-secondary text-sm">
            Creating your personalized AI transformation roadmap for{" "}
            <span className="text-user-accent font-medium">{data.company}</span>
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gabi-purple rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Confidence Indicator */}
        <div className="bg-interactive-bg/30 border border-interactive-border rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <p className="text-sm font-medium">
              High confidence analysis based on {Object.keys(data).length - 3} data points
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Step10Generation;