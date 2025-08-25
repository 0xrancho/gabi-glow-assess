import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
}

const getOpportunityOptions = (businessType: string) => {
  const options: Record<string, string[]> = {
    "IT Service Management (ITSM)": [
      "Compliance/Security Management",
      "Infrastructure/Cloud Optimization", 
      "Business Process Automation"
    ],
    "Custom Development": [
      "Enterprise SaaS Development",
      "API/Integration Services",
      "AI/ML Implementation",
      "E-commerce/Marketplace Platforms"
    ],
    "Marketing Agency": [
      "Demand Generation/Lead Gen",
      "Brand/Creative Strategy",
      "MarTech Implementation"
    ],
    "Management Consulting": [
      "Digital Transformation",
      "Operational Excellence",
      "Change Management"
    ],
    "Systems Integration": [
      "Enterprise Architecture",
      "Cloud Migration",
      "Legacy Modernization",
      "API Strategy"
    ],
    "Data & Analytics Consulting": [
      "Business Intelligence",
      "Predictive Analytics",
      "Data Engineering",
      "ML Operations"
    ],
    "Cybersecurity Services": [
      "Security Assessments",
      "Compliance Audits",
      "Incident Response",
      "Security Architecture"
    ],
    "Sales/Corporate Training": [
      "Sales Enablement",
      "Leadership Development",
      "Technical Training",
      "Change Management"
    ]
  };

  return options[businessType] || [];
};

const Step2OpportunityFocus = ({ data, updateData, onNext }: Props) => {
  const [selectedFocus, setSelectedFocus] = useState<string>(data.opportunityFocus || "");
  
  const options = getOpportunityOptions(data.businessType || "");
  
  const handleSelect = (focus: string) => {
    setSelectedFocus(focus);
    updateData({ opportunityFocus: focus });
  };

  const handleNext = () => {
    if (selectedFocus) {
      onNext();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          Which <span className="text-user-accent">{data.businessType}</span> area is your biggest opportunity?
        </h2>
        <p className="text-text-secondary">
          Focus on where you see the most potential for growth or efficiency gains
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`selection-card text-left ${
              selectedFocus === option ? 'selected' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-text-primary">{option}</h3>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedFocus === option
                  ? 'border-user-accent bg-user-accent'
                  : 'border-interactive-border'
              }`}>
                {selectedFocus === option && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedFocus}
          className="btn-gabi px-8"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default Step2OpportunityFocus;