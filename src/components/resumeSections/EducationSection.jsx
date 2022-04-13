import React, { useContext, useState } from 'react'
import { deleteEducationItem } from '../../api';
import EducationModal from './EducationModal';
import Loader from '../utils/Loader';
import Popconfirm from "../utils/Popconfirm";
import { ToastContext } from '../../App';

const EducationSection = ({ resumeData, onResumeChange }) => {

  const [educationModal, setEducationModal] = useState({ type: "", isOpen: false, edItem: null });
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteEducationItem(id);
    setLoading(false);
    onResumeChange();
    addToast({
      msg: "Deleted successfully",
      type: "success",
      autoClose: true
    });
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-2 py-4 border-b border-gray-200 text-sm">
            <div className='text-sm leading-5 text-gray-500 font-semibold w-44 uppercase'>Education</div>

            <div className='grow'>
              {resumeData.education && resumeData.education.map(edu => (
                <div key={edu.id} className='flex justify-between mb-3'>
                  <div className='flex flex-col gap-1.5 mb-2 text-gray-600 font-medium'>
                    <span className='font-bold'>{edu.degree}, {edu.stream}</span>
                    <span>{edu.college}</span>
                    <span>{edu.startYear} - {edu.endYear}</span>
                    {edu.performance && (edu.performanceScale == "percentage" ? (<span>Percentage: {edu.performance}%</span>) : (<span>CGPA: {edu.performance}/10</span>))}
                  </div>

                  <div>
                    <button className='text-gray-600 text-lg' onClick={() => setEducationModal({ type: "update", isOpen: true, edItem: edu })}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <Popconfirm title='Are you sure you want to delete this?' position='left' onConfirm={() => handleDelete(edu.id)}>
                      <button className='text-gray-600 text-lg ml-3'><i className="fa-solid fa-trash-can"></i></button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
              <button onClick={() => setEducationModal({ type: "add", isOpen: true })} className='text-sm leading-5 text-blue-500 font-medium cursor-pointer outline-none'>+ Add education</button>
            </div>
          </div >

          <EducationModal type={educationModal.type} isOpen={educationModal.isOpen} edItem={educationModal.edItem} onClose={() => setEducationModal({ type: "", isOpen: false, edItem: null })} onResumeChange={onResumeChange} />
        </>
      )}
    </>
  )
}

export default EducationSection