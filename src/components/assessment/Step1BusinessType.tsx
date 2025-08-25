import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Code, 
  Megaphone, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Shield, 
  GraduationCap 
} from "lucide-react";

interface Props {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
}

const businessTypes = [
  { 
    value: "IT Service Management (ITSM)", 
    icon: Settings, 
    label: "IT Service Management (ITSM)" 
  },
  { 
    value: "Custom Development", 
    icon: Code, 
    label: "Custom Development" 
  },
  { 
    value: "Marketing Agency", 
    icon: Megaphone, 
    label: "Marketing Agency" 
  },
  { 
    value: "Management Consulting", 
    icon: TrendingUp, 
    label: "Management Consulting" 
  },
  { 
    value: "Systems Integration", 
    icon: Zap, 
    label: "Systems Integration" 
  },
  { 
    value: "Data & Analytics Consulting", 
    icon: BarChart3, 
    label: "Data & Analytics Consulting" 
  },
  { 
    value: "Cybersecurity Services", 
    icon: Shield, 
    label: "Cybersecurity Services" 
  },
  { 
    value: "Sales/Corporate Training", 
    icon: GraduationCap, 
    label: "Sales/Corporate Training" 
  }
];

const Step1BusinessType = ({ data, updateData, onNext }: Props) => {
  const [selectedType, setSelectedType] = useState<string>(data.businessType || "");

  const handleSelect = (businessType: string) => {
    setSelectedType(businessType);
    updateData({ businessType });
  };

  const handleNext = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          What type of services do you primarily deliver?
        </h2>
        <p className="text-text-secondary">
          This helps us understand your business model and identify the best AI opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={`selection-card text-left ${
                selectedType === type.value ? 'selected' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedType === type.value 
                    ? 'bg-user-accent/20 text-user-accent' 
                    : 'bg-interactive-bg text-text-muted'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{type.label}</h3>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          className="btn-gabi px-8"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default Step1BusinessType;