
import { Resume } from '@/contexts/ResumeContext';

interface CreativeTemplateProps {
  resume: Resume;
}

const CreativeTemplate = ({ resume }: CreativeTemplateProps) => {
  const { personalInfo, summary, workExperience, education, skills } = resume;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-full">
      {/* Header */}
      <header className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              {personalInfo.firstName} <span className="font-light">{personalInfo.lastName}</span>
            </h1>
            <p className="text-xl mb-4 text-purple-200">{personalInfo.profession}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-4">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              {personalInfo.website}
            </div>
          )}
        </div>
      </header>

      <div className="p-8">
        {summary && (
          <section className="mb-10 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {workExperience.length > 0 && (
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-purple-600 mb-6">Experience</h2>
              <div className="space-y-8">
                {workExperience.map((experience) => (
                  <div key={experience.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-0.5 before:bg-purple-200">
                    <div className="absolute left-[-8px] top-1 h-4 w-4 rounded-full bg-purple-600"></div>
                    <h3 className="text-xl font-semibold">{experience.position}</h3>
                    <div className="text-purple-600 font-medium">{experience.company}</div>
                    <div className="text-sm text-gray-500 mb-2">
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

          <div className="space-y-8">
            {education.length > 0 && (
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">Education</h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="text-lg font-semibold">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                      <div className="text-purple-600">{edu.school}</div>
                      <div className="text-sm text-gray-500 mb-1">
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
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
