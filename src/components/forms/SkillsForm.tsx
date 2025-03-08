
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SkillItem } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus, Star, Sparkles } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const emptySkill: SkillItem = {
  id: '',
  name: '',
  level: 3,
};

const SkillsForm = () => {
  const { state, dispatch } = useResume();
  const { skills } = state;
  const [currentSkill, setCurrentSkill] = useState<SkillItem>({
    ...emptySkill,
    id: uuidv4(),
  });
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSkill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentSkill((prev) => ({
      ...prev,
      level: value[0],
    }));
  };

  const handleAddSkill = () => {
    // Basic validation
    if (!currentSkill.name) {
      return;
    }

    if (editMode) {
      dispatch({
        type: 'UPDATE_SKILL',
        payload: currentSkill,
      });
    } else {
      dispatch({
        type: 'ADD_SKILL',
        payload: currentSkill,
      });
    }

    // Reset form
    setCurrentSkill({
      ...emptySkill,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  const handleEditSkill = (skill: SkillItem) => {
    setCurrentSkill(skill);
    setEditMode(true);
  };

  const handleRemoveSkill = (id: string) => {
    dispatch({
      type: 'REMOVE_SKILL',
      payload: id,
    });
    
    // If we're editing the item that's about to be deleted, reset the form
    if (editMode && currentSkill.id === id) {
      setCurrentSkill({
        ...emptySkill,
        id: uuidv4(),
      });
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentSkill({
      ...emptySkill,
      id: uuidv4(),
    });
    setEditMode(false);
  };

  // Function to handle skill level labels
  const getSkillLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Basic';
      case 3:
        return 'Intermediate';
      case 4:
        return 'Advanced';
      case 5:
        return 'Expert';
      default:
        return 'Intermediate';
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-muted-foreground">
          Add the skills that are relevant to the positions you're applying for.
        </p>
      </div>

      <Card className="border rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            {editMode ? 'Edit Skill' : 'Add Skill'}
          </CardTitle>
          <CardDescription>
            Add technical and soft skills that showcase your strengths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. JavaScript, Project Management, Customer Service"
                value={currentSkill.name}
                onChange={handleInputChange}
                className="glass-input"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="level">Proficiency Level</Label>
                <span className="text-sm font-medium">
                  {getSkillLevelLabel(currentSkill.level)}
                </span>
              </div>
              <Slider
                id="level"
                min={1}
                max={5}
                step={1}
                value={[currentSkill.level]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
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
            onClick={handleAddSkill}
            className="ml-auto"
            disabled={!currentSkill.name}
          >
            {editMode ? 'Update' : 'Add'} Skill
          </Button>
        </CardFooter>
      </Card>

      {skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{skill.name}</h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-3.5 h-3.5 ${
                            index < skill.level
                              ? 'fill-primary text-primary'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                      <span className="text-xs ml-2 text-muted-foreground">
                        {getSkillLevelLabel(skill.level)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditSkill(skill)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveSkill(skill.id)}
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
            setCurrentSkill({
              ...emptySkill,
              id: uuidv4(),
            });
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Another Skill
        </Button>
      )}
    </div>
  );
};

export default SkillsForm;
