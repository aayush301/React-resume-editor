import React, { useContext, useEffect, useState } from 'react'
import { updatePersonalSection } from '../../api'
import Input from '../utils/Input'
import Loader from '../utils/Loader'
import Modal from '../utils/Modal'
import validateManyFields from "../../validations"
import { ToastContext } from '../../App'

const PersonalModal = ({ type, isOpen, pDetails, onClose, onResumeChange }) => {

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    const state = {
      id: pDetails?.id,
      email: pDetails?.email,
      firstName: pDetails?.firstName,
      lastName: pDetails?.lastName,
      mobile: pDetails?.mobile,
      city: pDetails?.city,
    }
    setFormData(state);
  }, [type, pDetails]);


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateManyFields("personal", formData);
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
    }
    else {
      setFormErrors({});
      setLoading(true);
      await updatePersonalSection(formData);
      setLoading(false);
      onClose();
      onResumeChange();
      addToast({
        msg: "Personal Details updated",
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
              <h1 className='mb-4 font-semibold text-xl text-center'>Personal Details</h1>

              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className="after:content-['*'] after:ml-0.5 after:text-red-500">First name</label>
                  <Input id="firstName" name="firstName" type="text" value={formData.firstName || ""} placeholder="First name" onChange={handleChange} />
                  {fieldError("firstName")}
                </div>

                <div className="flex-1">
                  <label htmlFor="lastName">Last name</label>
                  <Input id="lastName" name="lastName" type="text" value={formData.lastName || ""} placeholder="Last name" onChange={handleChange} />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">Email</label>
                <Input id="email" name="email" type="email" value={formData.email || ""} placeholder="Email" onChange={handleChange} />
                {fieldError("email")}
              </div>

              <div className="mb-4">
                <label htmlFor="mobile" className="after:content-['*'] after:ml-0.5 after:text-red-500">Mobile number</label>
                <Input id="mobile" name="mobile" type="number" value={formData.mobile || ""} placeholder="Mobile number" onChange={handleChange} />
                {fieldError("mobile")}
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="after:content-['*'] after:ml-0.5 after:text-red-500">City</label>
                <Input id="city" name="city" type="text" value={formData.city || ""} placeholder="City" onChange={handleChange} />
                {fieldError("city")}
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

export default PersonalModal