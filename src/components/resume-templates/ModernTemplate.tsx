
import { Resume } from '@/contexts/ResumeContext';

interface ModernTemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: ModernTemplateProps) => {
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <div className="bg-white min-h-full flex">
      {/* Left sidebar */}
      <div className="w-1/3 bg-blue-600 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg text-blue-200">{personalInfo.profession}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold border-b border-blue-400 pb-1 mb-3">Contact</h2>
          <div className="space-y-2 text-sm">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.website && <div>{personalInfo.website}</div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold border-b border-blue-400 pb-1 mb-3">Skills</h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center">
                  <div className="flex-1">{skill.name}</div>
                  <div className="w-1/2 h-1.5 bg-blue-400 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${skill.level * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-2/3 p-6">
        {summary && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Profile Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Work Experience</h2>
            <div className="space-y-4">
              {workExperience.map((experience) => (
                <div key={experience.id} className="border-l-2 border-blue-600 pl-4">
                  <h3 className="font-medium text-lg">{experience.position}</h3>
                  <div className="text-blue-600 font-medium">{experience.company}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                    {experience.current 
                      ? ' Present' 
                      : experience.endDate 
                        ? ` ${new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                        : ''
                    }
                  </div>
                  <div className="text-gray-700 whitespace-pre-line">{experience.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-blue-600 pl-4">
                  <h3 className="font-medium text-lg">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                  <div className="text-blue-600 font-medium">{edu.school}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - 
                    {edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })}` 
                      : ' Present'
                    }
                  </div>
                  {edu.description && <div className="text-gray-700">{edu.description}</div>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
