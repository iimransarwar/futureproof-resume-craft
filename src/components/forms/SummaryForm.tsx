
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { InfoIcon, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const SummaryForm = () => {
  const { state, dispatch } = useResume();
  const { summary } = state;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'SET_SUMMARY',
      payload: e.target.value,
    });
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    // In a real app, this would call an AI service
    setTimeout(() => {
      const { personalInfo, workExperience, skills } = state;
      
      // Generate a simple summary based on available information
      let generatedSummary = '';
      
      if (personalInfo.profession) {
        generatedSummary += `${personalInfo.profession} with `;
      }
      
      if (workExperience.length > 0) {
        const years = workExperience.reduce((total, exp) => {
          const startDate = new Date(exp.startDate);
          const endDate = exp.current ? new Date() : new Date(exp.endDate);
          const diffYears = (endDate.getFullYear() - startDate.getFullYear());
          return total + diffYears;
        }, 0);
        
        generatedSummary += `${years}+ years of experience `;
        
        // Get most recent job titles
        const recentPositions = workExperience
          .slice(0, 2)
          .map(exp => exp.position);
          
        if (recentPositions.length > 0) {
          generatedSummary += `specializing in ${recentPositions.join(' and ')}. `;
        }
      }
      
      // Add skills
      if (skills.length > 0) {
        const topSkills = skills
          .sort((a, b) => b.level - a.level)
          .slice(0, 3)
          .map(skill => skill.name);
          
        if (topSkills.length > 0) {
          generatedSummary += `Proficient in ${topSkills.join(', ')}. `;
        }
      }
      
      // Add generic closing
      generatedSummary += 'Seeking to leverage skills and experience to deliver exceptional results in a challenging new role.';
      
      dispatch({
        type: 'SET_SUMMARY',
        payload: generatedSummary,
      });
      
      setIsGenerating(false);
      toast.success('Summary generated successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-muted-foreground">
          Provide a brief overview of your professional background and key strengths.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <InfoIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-blue-700">
            Your professional summary appears at the top of your resume and is often the first thing employers read. Make it compelling and concise.
          </p>
          <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
            <li>Keep it between 3-5 sentences</li>
            <li>Highlight your most relevant skills and achievements</li>
            <li>Tailor it to the jobs you're applying for</li>
            <li>Avoid clichés and focus on specifics</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary" className="text-lg">
            Your Summary
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="flex items-center gap-1"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Auto-Generate'}</span>
          </Button>
        </div>
        <Textarea
          id="summary"
          value={summary}
          onChange={handleInputChange}
          placeholder="e.g. Results-driven marketing professional with 5+ years of experience in digital marketing and brand strategy. Proven track record of developing successful campaigns that increased engagement by 40% and drove a 25% growth in sales. Skilled in SEO, content marketing, and social media management, with a passion for data-driven decision making."
          className="glass-input min-h-[200px]"
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Example Summaries</h3>
        <div className="space-y-3">
          <div className="text-sm p-3 bg-white rounded border">
            <p>
              <strong>For Software Developer:</strong> Innovative software engineer with 7+ years of experience building scalable web applications and APIs. Specialized in JavaScript frameworks and cloud-native architectures. Strong problem-solving skills with a focus on delivering clean, maintainable code and exceptional user experiences.
            </p>
          </div>
          <div className="text-sm p-3 bg-white rounded border">
            <p>
              <strong>For Marketing Professional:</strong> Creative marketing manager with 5+ years of experience developing integrated marketing campaigns across digital and traditional channels. Proven record of increasing engagement metrics by 35% and driving conversion. Skilled in brand storytelling, content strategy, and analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
