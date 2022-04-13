import React, { useEffect, useState } from 'react'
import { fetchResume } from '../api';
import EducationSection from '../components/resumeSections/EducationSection';
import JobSection from '../components/resumeSections/JobSection';
import PersonalSection from '../components/resumeSections/PersonalSection';
import Loader from '../components/utils/Loader';

const ResumeForm = () => {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState({});

  useEffect(() => {
    handleResumeChange();
  }, []);

  const handleResumeChange = () => {
    setLoading(true);
    fetchResume().then(data => {
      setResumeData(data);
      setLoading(false);
    });
  }

  return (
    <>
      <header className='py-4 text-center shadow-md uppercase'>Resume Editor</header>

      {loading ? (
        <div className='sm:mx-16 my-20 border-2 border-gray-100 py-6 px-5 rounded-md text-center'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='sm:mx-16 my-20 border-2 border-gray-100 py-6 px-5 rounded-md'>
            <PersonalSection resumeData={resumeData} onResumeChange={handleResumeChange} />
            <EducationSection resumeData={resumeData} onResumeChange={handleResumeChange} />
            <JobSection resumeData={resumeData} onResumeChange={handleResumeChange} />
          </div>
        </>
      )}

    </>
  )
}

export default ResumeForm