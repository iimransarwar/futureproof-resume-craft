
import { Resume } from '@/contexts/ResumeContext';

interface ProfessionalTemplateProps {
  resume: Resume;
}

const ProfessionalTemplate = ({ resume }: ProfessionalTemplateProps) => {
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <div className="bg-white text-gray-800 min-h-full">
      {/* Header */}
      <header className="bg-gray-800 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl mb-4">{personalInfo.profession}</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
        </div>
      </header>

      <div className="p-8">
        {summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-3">Professional Summary</h2>
            <p className="text-gray-700">{summary}</p>
          </section>
        )}

        {workExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-3">Professional Experience</h2>
            <div className="space-y-6">
              {workExperience.map((experience) => (
                <div key={experience.id}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-semibold">{experience.position}</h3>
                    <div className="text-sm font-medium text-gray-600">
                      {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {experience.current 
                        ? ' Present' 
                        : experience.endDate 
                          ? ` ${new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                          : ''
                      }
                    </div>
                  </div>
                  <div className="text-lg font-medium mb-2">{experience.company}</div>
                  <div className="text-gray-700 whitespace-pre-line">{experience.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-3">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-lg font-semibold">{edu.school}</h3>
                    <div className="text-gray-800">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>
                    <div className="text-sm text-gray-600 mb-1">
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - 
                      {edu.endDate 
                        ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })}` 
                        : ' Present'
                      }
                    </div>
                    {edu.description && <div className="text-gray-700 mt-1">{edu.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-2 mb-3">Skills</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center">
                    <div className="w-full">
                      <div className="mb-1">{skill.name}</div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-800 rounded-full" 
                          style={{ width: `${skill.level * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
