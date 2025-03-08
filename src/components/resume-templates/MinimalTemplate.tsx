
import { Resume } from '@/types/resume';

interface MinimalTemplateProps {
  resume: Resume;
}

const MinimalTemplate = ({ resume }: MinimalTemplateProps) => {
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <div className="bg-white text-gray-800 p-8 shadow-sm rounded-sm min-h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-1">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl text-gray-600 mb-3">{personalInfo.profession}</p>
        
        <div className="flex flex-wrap text-sm gap-x-3 gap-y-1 text-gray-600">
          {personalInfo.email && (
            <div>{personalInfo.email}</div>
          )}
          {personalInfo.phone && (
            <div>{personalInfo.phone}</div>
          )}
          {(personalInfo.city || personalInfo.province) && (
            <div>
              {personalInfo.city}{personalInfo.city && personalInfo.province ? ', ' : ''}{personalInfo.province} {personalInfo.postalCode}
            </div>
          )}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Experience</h2>
          <div className="space-y-4">
            {workExperience.map((experience) => (
              <div key={experience.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{experience.position}</h3>
                  <div className="text-sm text-gray-600">
                    {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                    {experience.current 
                      ? ' Present' 
                      : experience.endDate 
                        ? ` ${new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                        : ''
                    }
                  </div>
                </div>
                <div className="text-gray-700 font-medium">{experience.company}</div>
                <div className="text-gray-700 mt-1 whitespace-pre-line">{experience.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                  <div className="text-sm text-gray-600">
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' })} - 
                    {edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' })}` 
                      : ' Present'
                    }
                  </div>
                </div>
                <div className="text-gray-700 font-medium">{edu.school}</div>
                {edu.description && <div className="text-gray-700 mt-1">{edu.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold border-b border-gray-200 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                {skill.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
