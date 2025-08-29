// Enhanced Deep Research Report Generation Engine
// Multi-call research pipeline with cross-sectional analysis

import { generateReport } from './openai';
import type { EnhancedAssessmentData, ContextInferences, ResearchResult } from '@/types/assessment';
import { inferBusinessContext } from '@/lib/contextInference';
import { RESEARCH_SEQUENCE, RESEARCH_SYSTEM_PROMPT, simplifyPrompt } from '@/lib/researchSequence';
import { saveReport, type ReportRecord } from '@/lib/supabase';
import { enhanceAssessmentData, extractSuccessMetrics } from '@/lib/dataHelpers';
import { compileResearchTargets } from '@/lib/assessment/input-compiler';
import { executeResearch } from '@/lib/assessment/research-engine';
import { synthesizeReport } from '@/lib/assessment/report-synthesizer';
import { formatHTMLReport } from '@/lib/assessment/report-formatter';

// Progress tracking for the new system
export interface DeepResearchProgress {
  type: 'start' | 'progress' | 'complete' | 'report' | 'error';
  message?: string;
  step?: string;
  phase?: 'researching' | 'complete';
  duration?: number;
  html?: string;
  metrics?: {
    tokens: number;
    duration: number;
  };
}

// Enhanced report generation result
export interface DeepReportGenerationResult {
  success: boolean;
  reportHtml?: string;
  error?: string;
  metadata: {
    totalTokens: number;
    duration: number;
    confidence: number;
    phases: string[];
  };
}

// OpenAI client setup for direct calls (since this is Vite, not Next.js)
class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async chat(messages: any[], options: any = {}) {
    if (!this.apiKey) {
      console.error('❌ OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('🤖 OpenAI API call - model:', options.model || 'gpt-4o');
    console.log('📝 Messages count:', messages.length);
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 2500,
        ...options
      })
    });

    console.log('📨 OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ OpenAI response received, tokens used:', result.usage?.total_tokens);
    return result;
  }
}

// Main Deep Research Engine
export class DeepReportGenerationEngine {
  private progressCallback?: (progress: DeepResearchProgress) => void;
  private openai: OpenAIService;
  private startTime: number = 0;

  constructor(progressCallback?: (progress: DeepResearchProgress) => void) {
    this.progressCallback = progressCallback;
    this.openai = new OpenAIService();
  }

  private sendProgress(progress: DeepResearchProgress) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  async generateDeepResearchReport(data: any): Promise<DeepReportGenerationResult> {
    console.log('🎯 DeepReportGenerator: Starting generation');
    console.log('📊 Input data keys:', Object.keys(data));
    console.log('🏢 Company:', data.company);
    console.log('💼 Business Type:', data.businessType);
    
    this.startTime = Date.now();
    let totalTokens = 0;
    const phasesCompleted: string[] = [];

    try {
      // Send initial status
      console.log('📢 Sending initial progress status');
      this.sendProgress({
        type: 'start',
        message: 'Analyzing your business context...'
      });

      // STEP 1: Infer business context and multiplier effects
      console.log('🧠 STEP 1: Inferring business context...');
      const contextInferences = await inferBusinessContext(data);
      console.log('✅ Context inferences:', contextInferences);
      phasesCompleted.push('context_inference');

      // STEP 2: Execute Perplexity research to gather real-world data
      console.log('🔍 STEP 2: Starting Perplexity research...');
      this.sendProgress({
        type: 'progress',
        step: 'Researching industry benchmarks and solutions...',
        phase: 'researching'
      });

      let perplexityResearchContent = '';
      try {
        console.log('📋 Compiling research targets...');
        const researchTargets = compileResearchTargets(data);
        console.log('🎯 Research targets:', researchTargets);
        
        console.log('🌐 Calling Perplexity API via executeResearch...');
        perplexityResearchContent = await executeResearch(researchTargets, data, contextInferences);
        console.log('✅ Perplexity research completed successfully');
        console.log('📄 Research content length:', perplexityResearchContent.length);
        phasesCompleted.push('perplexity_research');
      } catch (error) {
        console.error('❌ Perplexity research failed:', error);
        console.error('Stack trace:', error.stack);
        // Continue without Perplexity research if it fails
      }

      // STEP 3: Execute OpenAI synthesis pipeline with Perplexity research as context
      const researchResults: ResearchResult[] = [];
      
      // Add Perplexity research as the first result if available
      if (perplexityResearchContent) {
        researchResults.push({
          name: 'perplexity_research',
          content: perplexityResearchContent
        });
      }

      for (let i = 0; i < RESEARCH_SEQUENCE.length; i++) {
        const step = RESEARCH_SEQUENCE[i];

        // Send progress update
        this.sendProgress({
          type: 'progress',
          step: step.displayName,
          phase: 'researching'
        });

        try {
          // Generate prompt with cross-sectional context and dependencies
          let prompt = step.promptGenerator(
            data,
            contextInferences,
            researchResults // Pass all previous results for dependency chain
          );

          // If we have Perplexity research, add it as context for better synthesis
          if (perplexityResearchContent && i === 0) {
            prompt = `Based on the following real-world research data:\n\n${perplexityResearchContent}\n\n${prompt}`;
          }

          // Make OpenAI API call
          const response = await this.openai.chat([
            { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ]);

          const content = response.choices[0].message.content;
          totalTokens += response.usage?.total_tokens || 0;

          researchResults.push({
            name: step.name,
            content: content
          });

          // Send step completion
          this.sendProgress({
            type: 'complete',
            step: step.displayName,
            duration: (Date.now() - this.startTime) / 1000
          });

        } catch (error: any) {
          console.error(`Research step ${step.name} failed:`, error);
          
          // Retry with simplified prompt
          try {
            const simplified = simplifyPrompt(step.promptGenerator(data, contextInferences, researchResults));
            const retryResponse = await this.openai.chat([
              { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
              { role: 'user', content: simplified }
            ], { max_tokens: 1500 });

            researchResults.push({
              name: step.name,
              content: retryResponse.choices[0].message.content,
              wasRetry: true
            });

            totalTokens += retryResponse.usage?.total_tokens || 0;

          } catch (retryError) {
            // If retry fails, add a placeholder result to maintain chain
            researchResults.push({
              name: step.name,
              content: `Analysis for ${step.displayName} temporarily unavailable due to technical constraints.`,
              wasRetry: true
            });
          }
        }

        phasesCompleted.push(step.name);
      }

      // STEP 3: Synthesize report using proper GABI format
      console.log('📋 STEP 3: Synthesizing report with GABI format...');
      
      // Combine research findings into a single string
      const combinedResearch = researchResults.map(result => 
        `## ${result.name}\n${result.content}`
      ).join('\n\n');
      
      const synthesizedReport = await synthesizeReport(
        data, 
        combinedResearch, 
        contextInferences
      );
      console.log('✅ Report synthesis completed, length:', synthesizedReport.length);
      
      // STEP 4: Format as HTML
      console.log('🎨 STEP 4: Formatting as HTML...');
      const businessName = data.company || data.businessName || 'Your Company';
      const finalReportHtml = formatHTMLReport(synthesizedReport, businessName);
      console.log('✅ HTML formatting completed, length:', finalReportHtml.length);

      // STEP 5: Save to database if possible
      try {
        const reportRecord: Omit<ReportRecord, 'id'> = {
          assessment_id: data.sessionId || '',
          report_data: {
            research_results: researchResults,
            context_inferences: contextInferences,
            enhanced_data: data
          },
          executive_summary: this.extractExecutiveSummary(researchResults),
          confidence_score: this.calculateOverallConfidence(researchResults),
          generation_time_ms: Date.now() - this.startTime,
          tokens_used: totalTokens,
          model_version: 'gpt-4o-deep-research',
          status: 'generated'
        };

        await saveReport(reportRecord);
      } catch (saveError) {
        console.warn('Could not save report to database:', saveError);
        // Continue without database save
      }

      // Send final report
      this.sendProgress({
        type: 'report',
        html: finalReportHtml,
        metrics: {
          tokens: totalTokens,
          duration: (Date.now() - this.startTime) / 1000
        }
      });

      return {
        success: true,
        reportHtml: finalReportHtml,
        metadata: {
          totalTokens,
          duration: Date.now() - this.startTime,
          confidence: this.calculateOverallConfidence(researchResults),
          phases: phasesCompleted
        }
      };

    } catch (error: any) {
      console.error('Deep report generation failed:', error);
      
      this.sendProgress({
        type: 'error',
        message: error.message || 'Report generation failed'
      });

      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        metadata: {
          totalTokens,
          duration: Date.now() - this.startTime,
          confidence: 0,
          phases: phasesCompleted
        }
      };
    }
  }


  private extractExecutiveSummary(results: ResearchResult[]): string {
    const roiResult = results.find(r => r.name === 'ROI_ANALYSIS');
    if (roiResult) {
      // Extract first paragraph or summary from ROI analysis
      const lines = roiResult.content.split('\n').filter(line => line.trim());
      return lines.slice(0, 3).join(' ').substring(0, 500);
    }
    return 'Comprehensive AI transformation analysis completed with detailed recommendations.';
  }

  private calculateOverallConfidence(results: ResearchResult[]): number {
    // Base confidence on successful completion of research steps
    const completedSteps = results.filter(r => r.content && !r.content.includes('temporarily unavailable'));
    return Math.min(0.95, (completedSteps.length / RESEARCH_SEQUENCE.length) * 0.9 + 0.1);
  }
}

// Factory function
export const createDeepReportGenerator = (
  progressCallback?: (progress: DeepResearchProgress) => void
): DeepReportGenerationEngine => {
  return new DeepReportGenerationEngine(progressCallback);
};

// Utility to convert enhanced data to assessment record for compatibility
export const convertToAssessmentRecord = (data: EnhancedAssessmentData): any => {
  return {
    id: data.sessionId,
    session_id: data.sessionId,
    email: data.email,
    company: data.company,
    full_name: data.fullName,
    subscribe_updates: data.subscribeUpdates,
    business_type: data.businessType || data.businessType,
    opportunity_focus: data.opportunityFocus,
    revenue_model: data.revenueModel,
    challenges: data.challenges,
    metrics: data.metrics,
    metrics_quantified: data.metricsQuantified,
    team_description: data.teamDescription,
    process_description: data.processDescription || data.teamProcess,
    tech_stack: data.techStack,
    investment_level: data.investmentLevel,
    additional_context: data.additionalContext
  };
};