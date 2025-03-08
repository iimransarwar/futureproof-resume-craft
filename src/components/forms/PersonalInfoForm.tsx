
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, User } from 'lucide-react';
import { toast } from 'sonner';

const PersonalInfoForm = () => {
  const { state, dispatch } = useResume();
  const { personalInfo } = state;
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: 'SET_PERSONAL_INFO',
      payload: { [name]: value },
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          dispatch({
            type: 'SET_PERSONAL_INFO',
            payload: { photoUrl: event.target.result as string },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <p className="text-muted-foreground">
          Let's start with the basics. This information will appear at the top of your resume.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
              {personalInfo.photoUrl ? (
                <img 
                  src={personalInfo.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <div className="absolute bottom-0 right-0">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="e.g. John"
              value={personalInfo.firstName || ''}
              onChange={handleInputChange}
              className="glass-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="e.g. Smith"
              value={personalInfo.lastName || ''}
              onChange={handleInputChange}
              className="glass-input"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profession">Professional Title <span className="text-red-500">*</span></Label>
          <Input
            id="profession"
            name="profession"
            placeholder="e.g. Senior Software Engineer"
            value={personalInfo.profession || ''}
            onChange={handleInputChange}
            className="glass-input"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="e.g. San Francisco"
              value={personalInfo.city || ''}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">State/Province</Label>
            <Input
              id="province"
              name="province"
              placeholder="e.g. California"
              value={personalInfo.province || ''}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="e.g. 94103"
              value={personalInfo.postalCode || ''}
              onChange={handleInputChange}
              className="glass-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. john.smith@example.com"
              value={personalInfo.email || ''}
              onChange={handleInputChange}
              className="glass-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              placeholder="e.g. (555) 123-4567"
              value={personalInfo.phone || ''}
              onChange={handleInputChange}
              className="glass-input"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
