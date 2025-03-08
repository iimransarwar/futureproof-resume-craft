
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { WorkExperienceItem } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus, Briefcase } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const emptyExperience: WorkExperienceItem = {
  id: '',
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

const WorkExperienceForm = () => {
  const { state, dispatch } = useResume();
  const { workExperience } = state;
  const [currentExperience, setCurrentExperience] = useState<WorkExperienceItem>({
    ...emptyExperience,
    id: uuidv4(),
  });
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentExperience((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? '' : prev.endDate,
    }));
  };

  const handleAddExperience = () => {
    // Basic validation
    if (!currentExperience.company || !currentExperience.position || !currentExperience.startDate) {
      return;
    }

    if (editMode) {
      dispatch({
        type: 'UPDATE_WORK_EXPERIENCE',
        payload: currentExperience,
      });
    } else {
      dispatch({
        type: 'ADD_WORK_EXPERIENCE',
        payload: currentExperience,
      });
    }

    // Reset form
    setCurrentExperience({
      ...emptyExperience,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  const handleEditExperience = (experience: WorkExperienceItem) => {
    setCurrentExperience(experience);
    setEditMode(true);
  };

  const handleRemoveExperience = (id: string) => {
    dispatch({
      type: 'REMOVE_WORK_EXPERIENCE',
      payload: id,
    });
    
    // If we're editing the item that's about to be deleted, reset the form
    if (editMode && currentExperience.id === id) {
      setCurrentExperience({
        ...emptyExperience,
        id: uuidv4(),
      });
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentExperience({
      ...emptyExperience,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-muted-foreground">
          Add your relevant work experience, starting with the most recent position.
        </p>
      </div>

      <Card className="border rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            {editMode ? 'Edit Position' : 'Add Position'}
          </CardTitle>
          <CardDescription>
            Include company name, your job title, and your contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Acme Corporation"
                  value={currentExperience.company}
                  onChange={handleInputChange}
                  className="glass-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Job Title</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="e.g. Senior Developer"
                  value={currentExperience.position}
                  onChange={handleInputChange}
                  className="glass-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="month"
                  value={currentExperience.startDate}
                  onChange={handleInputChange}
                  className="glass-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="current-job"
                      checked={currentExperience.current}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="current-job" className="text-sm">
                      Current Position
                    </Label>
                  </div>
                </div>
                <Input
                  id="endDate"
                  name="endDate"
                  type="month"
                  value={currentExperience.endDate}
                  onChange={handleInputChange}
                  disabled={currentExperience.current}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description (responsibilities, achievements)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your responsibilities, achievements, and the skills you used. Use bullet points by starting lines with • or -"
                value={currentExperience.description}
                onChange={handleInputChange}
                className="glass-input min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {editMode && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleAddExperience}
            className="ml-auto"
            disabled={!currentExperience.company || !currentExperience.position || !currentExperience.startDate}
          >
            {editMode ? 'Update' : 'Add'} Position
          </Button>
        </CardFooter>
      </Card>

      {workExperience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Work Experience</h3>
          <div className="space-y-3">
            {workExperience.map((experience) => (
              <div
                key={experience.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 text-primary mr-2" />
                    <h4 className="font-medium">{experience.position}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {experience.company} • 
                    {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                    {experience.current 
                      ? ' Present' 
                      : experience.endDate 
                        ? ` ${new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                        : ''
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditExperience(experience)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveExperience(experience.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!editMode && (
        <Button
          variant="outline"
          className="w-full py-6"
          onClick={() => {
            setCurrentExperience({
              ...emptyExperience,
              id: uuidv4(),
            });
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Another Position
        </Button>
      )}
    </div>
  );
};

export default WorkExperienceForm;
