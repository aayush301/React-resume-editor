import React, { useContext, useState } from 'react'
import { deleteJobItem } from '../../api';
import { ToastContext } from '../../App';
import Loader from '../utils/Loader';
import Popconfirm from "../utils/Popconfirm";
import JobModal from './JobModal';

const JobSection = ({ resumeData, onResumeChange }) => {

  const [jobModal, setJobModal] = useState({ type: "", isOpen: false, job: null });
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteJobItem(id);
    setLoading(false);
    onResumeChange();
    addToast({
      msg: "Deleted successfully",
      type: "success",
      autoClose: true
    });
  }

  const getFormattedDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", { month: "short", year: "numeric" });
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-2 py-4 border-b border-gray-200 text-sm">
            <div className='text-sm leading-5 text-gray-500 font-semibold w-44 uppercase'>Jobs</div>

            <div className='grow'>
              {resumeData.jobs && resumeData.jobs.map(job => (
                <div key={job.id} className='flex justify-between mb-3'>
                  <div className='flex flex-col gap-1.5 mb-2 text-gray-600 font-medium'>
                    <span className='font-bold'>{job.profile}</span>
                    <span>{job.organization}, {job.workFromHome ? "Work from Home" : job.location}</span>
                    <span>{getFormattedDate(job.startDate)} - {job.currentlyWorkingHere ? "Present" : getFormattedDate(job.endDate)}</span>
                    {job.description && (<div className='whitespace-pre-line'>{job.description}</div>)}
                  </div>

                  <div className='shrink-0'>
                    <button className='text-gray-600 text-lg' onClick={() => setJobModal({ type: "update", isOpen: true, job: job })}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <Popconfirm title='Are you sure you want to delete this?' position='left' onConfirm={() => handleDelete(job.id)}>
                      <button className='text-gray-600 text-lg ml-3'><i className="fa-solid fa-trash-can"></i></button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
              <button onClick={() => setJobModal({ type: "add", isOpen: true })} className='text-sm leading-5 text-blue-500 font-medium cursor-pointer outline-none'>+ Add job</button>
            </div>
          </div >

          <JobModal type={jobModal.type} isOpen={jobModal.isOpen} job={jobModal.job} onClose={() => setJobModal({ type: "", isOpen: false, job: null })} onResumeChange={onResumeChange} />
        </>
      )}
    </>
  )
}

export default JobSection