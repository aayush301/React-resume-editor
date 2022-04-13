import React, { useContext, useEffect, useState } from 'react'
import { updateJobsInResume } from '../../api'
import Input, { DatePicker, Textarea } from '../utils/Input'
import Modal from '../utils/Modal'
import validateManyFields from "../../validations"
import Loader from '../utils/Loader'
import Checkbox from '../utils/Checkbox'
import { ToastContext } from '../../App'

const JobModal = ({ type, isOpen, job, onClose, onResumeChange }) => {

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const state = (type == "update") ? {
      id: job.id,
      profile: job.profile,
      organization: job.organization,
      location: job.location,
      workFromHome: job.workFromHome,
      startDate: job.startDate,
      endDate: job.endDate,
      currentlyWorkingHere: job.currentlyWorkingHere,
      description: job.description
    } : {
      profile: null,
      organization: null,
      location: null,
      workFromHome: false,
      startDate: null,
      endDate: null,
      currentlyWorkingHere: false,
      description: null
    }
    setFormData(state);
  }, [type, job]);


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleCheckboxChange = (name, value, checked) => {
    if (name == "workFromHome") {
      setFormData({ ...formData, location: null, [name]: checked });
    }
    else if (name == "currentlyWorkingHere") {
      setFormData({ ...formData, endDate: null, [name]: checked });
    }
  }


  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateManyFields("job", formData);
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
    }
    else {
      setFormErrors({});
      setLoading(true);
      await updateJobsInResume(formData, type);
      setLoading(false);
      onClose();
      onResumeChange();
      addToast({
        msg: "Updated successfully",
        type: "success",
        autoClose: true
      });
    }
  }


  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='w-[600px] max-w-[100vw] h-[500px] p-8 text-sm'>
          {loading ? (
            <Loader />
          ) : (
            <>
              <h1 className='mb-4 font-semibold text-xl text-center'>Education Details</h1>

              <div className="mb-4">
                <label htmlFor="profile" className="after:content-['*'] after:ml-0.5 after:text-red-500">Profile</label>
                <Input id="profile" name="profile" type="text" value={formData.profile || ""} placeholder="e.g. SDE" onChange={handleChange} />
                {fieldError("profile")}
              </div>

              <div className="mb-4">
                <label htmlFor="organization" className="after:content-['*'] after:ml-0.5 after:text-red-500">Organization</label>
                <Input id="organization" name="organization" type="text" value={formData.organization || ""} placeholder="e.g. Microsoft" onChange={handleChange} />
                {fieldError("organization")}
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="after:content-['*'] after:ml-0.5 after:text-red-500">Location</label>
                <Input id="location" name="location" type="text" value={formData.workFromHome ? "Work From Home" : (formData.location || "")} disabled={formData.workFromHome} placeholder="e.g. Noida" onChange={handleChange} />
                {fieldError("location")}
                <Checkbox label="Work from home" id="work-from-home" name="workFromHome" checked={formData.workFromHome} onChange={handleCheckboxChange} />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className='flex-1'>
                  <label htmlFor="start-date" className="after:content-['*'] after:ml-0.5 after:text-red-500">Start date</label>
                  <DatePicker name="startDate" id="start-date" value={formData.startDate || ""} onChange={handleChange} />
                  {fieldError("startDate")}
                </div>

                <div className='flex-1'>
                  <label htmlFor="end-date" className="after:content-['*'] after:ml-0.5 after:text-red-500">End date</label>
                  <DatePicker name="endDate" id="end-date" value={formData.endDate || ""} disabled={formData.currentlyWorkingHere} onChange={handleChange} />
                  {fieldError("endDate")}
                  <Checkbox label="Currently working here" id="currently-working-here" name="currentlyWorkingHere" checked={formData.currentlyWorkingHere} onChange={handleCheckboxChange} />
                </div>
              </div>

              <div className='mb-4'>
                <label htmlFor="description">Description</label>
                <div className='my-3 border border-gray-300 bg-gray-100 p-4 rounded-md'>
                  <h4 className='font-bold text-gray-700 text-md'>Tip:</h4>
                  <ul className='list-disc flex flex-col gap-3 px-6 py-3 text-gray-700'>
                    <li>Mention key job responsibilities, measurable impact or results you helped deliver, any awards/recognition you won during this time</li>
                    <li>Use action verbs: Built, Led, Drove, Conceptualized, Learnt, etc.</li>
                    <li>Use numbers and percentages wherever possible</li>
                  </ul>
                </div>
                <Textarea id="description" name="description" type="text" value={formData.description || ""} placeholder="Short description of work done" onChange={handleChange} />
              </div>



              <div className='flex'>
                <button className='ml-auto mt-3 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 font-semibold rounded-[3px]' onClick={handleSubmit}>Save</button>
              </div>
            </>
          )}

        </div>
      </Modal>
    </>
  )
}

export default JobModal