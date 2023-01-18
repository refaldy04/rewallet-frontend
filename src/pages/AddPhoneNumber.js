import React from 'react'
import Navbar from '../component/Navbar'
import Dropdown from '../component/Dropdown'
import Footer from '../component/Footer'
import '../asset/css/add-phone-number.css'
import FormPhone from '../component/FormPhone'
import Sidebar from '../component/Sidebar'

export const AddPhoneNumber = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <Sidebar />

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-2 bg-light rounded-4 fw9-input-amount">
            <h4>Add Phone Number</h4>
            <p>Add at least one phone number for the transfer ID so you can start transfering your money to another user.</p>
            <div className="mx-auto d-flex justify-content-center align-items-center add-phone-btn">
              <FormPhone />

              {/* <div className="col-auto my-5">
                  <label className="visually-hidden" htmlFor="autoSizingInputGroup">
                    Email
                  </label>
                  <div className="input-group">
                    <span className="fw-bold">+62</span>
                    <input type="text" className="form-control" placeholder="Enter your phone number" />
                  </div>
                </div>
                <Link to="/personal-information" className="d-grid gap-2 my-5">
                  <button className="btn btn-primary" type="button">
                    Continue
                  </button>
                </Link> */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AddPhoneNumber
