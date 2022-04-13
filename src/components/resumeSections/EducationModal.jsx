import React, { useContext, useEffect, useState } from 'react'
import { updateEducationInResume } from '../../api'
import Input from '../utils/Input'
import Loader from '../utils/Loader'
import Modal from '../utils/Modal'
import SelectMenu from '../utils/SelectMenu'
import validateManyFields from "../../validations"
import { ToastContext } from '../../App'

const EducationModal = ({ type, isOpen, edItem, onClose, onResumeChange }) => {

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const state = (type == "update") ? {
      id: edItem.id,
      college: edItem.college,
      startYear: edItem.startYear,
      endYear: edItem.endYear,
      degree: edItem.degree,
      stream: edItem.stream,
      performanceScale: edItem.performanceScale,
      performance: edItem.performance
    } : {
      college: null,
      startYear: null,
      endYear: null,
      degree: null,
      stream: null,
      performanceScale: "percentage",
      performance: null
    }
    setFormData(state);
  }, [type, edItem]);


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSelectChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateManyFields("education", formData);
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
    }
    else {
      setFormErrors({});
      setLoading(true);
      await updateEducationInResume(formData, type);
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

  const startYearList = [...Array(new Date().getFullYear() - 1980 + 2)].map((_, i) => ({ label: i + 1980, value: i + 1980 })).reverse();
  const endYearList = [...Array(new Date().getFullYear() - 1980 + 7)].map((_, i) => ({ label: i + 1980, value: i + 1980 })).reverse();
  const performanceScaleSelectList = [
    {
      label: "Percentage",
      value: "percentage"
    },
    {
      label: "CGPA (Scale of 10)",
      value: "cgpa",
    },
  ]

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
                <label htmlFor="college" className="after:content-['*'] after:ml-0.5 after:text-red-500">College</label>
                <Input id="college" name="college" type="text" value={formData.college || ""} placeholder="e.g. Hindu College" onChange={handleChange} />
                {fieldError("college")}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className='flex-1'>
                  <label htmlFor="start-year" className="after:content-['*'] after:ml-0.5 after:text-red-500">Start year</label>
                  <SelectMenu title="Choose year" id="start-year" value={formData.startYear || ""} name="startYear" list={startYearList} onChange={handleSelectChange} />
                  {fieldError("startYear")}
                </div>

                <div className='flex-1'>
                  <label htmlFor="end-year" className="after:content-['*'] after:ml-0.5 after:text-red-500">End year</label>
                  <SelectMenu title="Choose year" id="end-year" name="endYear" value={formData.endYear || ""} list={endYearList} onChange={handleSelectChange} />
                  {fieldError("endYear")}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className='flex-1'>
                  <label htmlFor="degree" className="after:content-['*'] after:ml-0.5 after:text-red-500">Degree</label>
                  <Input id="degree" type="text" name="degree" value={formData.degree || ""} placeholder="e.g. B.Sc.(Hons.)" onChange={handleChange} />
                  {fieldError("degree")}
                </div>
                <div className='flex-1'>
                  <label htmlFor="stream" className="after:content-['*'] after:ml-0.5 after:text-red-500">Stream</label>
                  <Input id="stream" type="text" name="stream" value={formData.stream || ""} placeholder="e.g. Economics" onChange={handleChange} />
                  {fieldError("stream")}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className='flex-1'>
                  <label htmlFor="performance-scale">Performance Scale</label>
                  <SelectMenu title=".." id="performance-scale" name="performanceScale" value={formData.performanceScale} list={performanceScaleSelectList} onChange={handleSelectChange} />
                </div>

                <div className='flex-1'>
                  <label htmlFor="performance">Performance</label>
                  <Input id="performance" type="number" name="performance" value={formData.performance || ""} placeholder="0.00" onChange={handleChange} />
                  {fieldError("performance")}
                </div>
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

export default EducationModal