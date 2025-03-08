
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EducationItem } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus, GraduationCap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const emptyEducation: EducationItem = {
  id: '',
  school: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  description: '',
};

const EducationForm = () => {
  const { state, dispatch } = useResume();
  const { education } = state;
  const [currentEducation, setCurrentEducation] = useState<EducationItem>({
    ...emptyEducation,
    id: uuidv4(),
  });
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEducation = () => {
    // Basic validation
    if (!currentEducation.school || !currentEducation.degree) {
      return;
    }

    if (editMode) {
      dispatch({
        type: 'UPDATE_EDUCATION',
        payload: currentEducation,
      });
    } else {
      dispatch({
        type: 'ADD_EDUCATION',
        payload: currentEducation,
      });
    }

    // Reset form
    setCurrentEducation({
      ...emptyEducation,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  const handleEditEducation = (education: EducationItem) => {
    setCurrentEducation(education);
    setEditMode(true);
  };

  const handleRemoveEducation = (id: string) => {
    dispatch({
      type: 'REMOVE_EDUCATION',
      payload: id,
    });
    
    // If we're editing the item that's about to be deleted, reset the form
    if (editMode && currentEducation.id === id) {
      setCurrentEducation({
        ...emptyEducation,
        id: uuidv4(),
      });
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentEducation({
      ...emptyEducation,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-muted-foreground">
          Add your educational background, including degrees, certifications, and courses.
        </p>
      </div>

      <Card className="border rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            {editMode ? 'Edit Education' : 'Add Education'}
          </CardTitle>
          <CardDescription>
            Include your school, degree, and relevant accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school">School/University</Label>
              <Input
                id="school"
                name="school"
                placeholder="e.g. Stanford University"
                value={currentEducation.school}
                onChange={handleInputChange}
                className="glass-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  placeholder="e.g. Bachelor of Science"
                  value={currentEducation.degree}
                  onChange={handleInputChange}
                  className="glass-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  placeholder="e.g. Computer Science"
                  value={currentEducation.fieldOfStudy}
                  onChange={handleInputChange}
                  className="glass-input"
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
                  value={currentEducation.startDate}
                  onChange={handleInputChange}
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (or expected)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="month"
                  value={currentEducation.endDate}
                  onChange={handleInputChange}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your academic achievements, relevant coursework, or extracurricular activities"
                value={currentEducation.description}
                onChange={handleInputChange}
                className="glass-input min-h-[100px]"
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
            onClick={handleAddEducation}
            className="ml-auto"
            disabled={!currentEducation.school || !currentEducation.degree}
          >
            {editMode ? 'Update' : 'Add'} Education
          </Button>
        </CardFooter>
      </Card>

      {education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-primary mr-2" />
                    <h4 className="font-medium">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {edu.school} • 
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - 
                    {edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })}` 
                      : ' Present'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditEducation(edu)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveEducation(edu.id)}
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
            setCurrentEducation({
              ...emptyEducation,
              id: uuidv4(),
            });
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Another Education
        </Button>
      )}
    </div>
  );
};

export default EducationForm;
