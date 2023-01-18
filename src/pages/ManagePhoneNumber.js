import React from 'react'
import '../asset/css/manage-phone-number.css'
import Navbar from '../component/Navbar'
import Dropdown from '../component/Dropdown'
import Footer from '../component/Footer'
import { FiTrash } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../component/Sidebar'

export const ManagePhoneNumber = () => {
  const profile = useSelector((state) => state.profile.data)

  return (
    <div>
      <Navbar />
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <Sidebar />

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
            <h4>Manage Phone Number</h4>
            <p>You can only delete the phone number and then you must add another phone number.</p>
            <div className="d-flex justify-content-between align-items-center container">
              <div>
                <h5>Primary</h5>
                <h3 className="this-is-my-phone">{profile.phone_number}</h3>
              </div>
              <Link to="/add-phone-number">
                <IconContext.Provider value={{ size: '2em' }}>
                  <div>
                    <FiTrash />
                  </div>
                </IconContext.Provider>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ManagePhoneNumber
