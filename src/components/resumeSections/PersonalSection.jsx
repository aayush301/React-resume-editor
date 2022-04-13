import React, { useState } from 'react'
import Loader from '../utils/Loader';
import PersonalModal from './PersonalModal';

const PersonalSection = ({ resumeData, onResumeChange }) => {

  const [personalSectionModal, setPersonalSectionModal] = useState({ isOpen: false, pDetails: null });
  const pDetails = resumeData?.personal;

  return (
    <>
      <div className='py-4 border-b border-gray-200'>
        <h2 className='text-2xl'>
          <span>{pDetails?.firstName ? `${pDetails.firstName} ${pDetails.lastName || ""}` : "name"}</span>
          <button className='ml-2 text-gray-600 text-lg' onClick={() => setPersonalSectionModal({ type: "update", isOpen: true, pDetails })}>
            <i className="fa-solid fa-pen"></i>
          </button>
        </h2>
        <div className="flex flex-col gap-1.5 text-gray-500">
          <div>{pDetails?.email || "email"}</div>
          <div>{pDetails?.mobile || "mobile"}</div>
          <div>{pDetails?.city || "city"}</div>
        </div>
      </div>

      <PersonalModal isOpen={personalSectionModal.isOpen} pDetails={personalSectionModal.pDetails} onClose={() => setPersonalSectionModal({ isOpen: false, pDetails: null })} onResumeChange={onResumeChange} />
    </>
  )
}

export default PersonalSection