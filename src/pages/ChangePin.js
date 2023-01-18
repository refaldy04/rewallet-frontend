import React from 'react'
import '../asset/css/change-pin.css'
import Navbar from '../component/Navbar'
import Dropdown from '../component/Dropdown'
import { Link } from 'react-router-dom'
import Footer from '../component/Footer'
import Sidebar from '../component/Sidebar'

export const ChangePin = () => {
  React.useEffect(() => {
    window.alert('in development')
  }, [])
  return (
    <div>
      <Navbar />
      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <Sidebar />

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-2 bg-light rounded-4 fw9-input-amount">
            <h4>Change PIN</h4>
            <p>Enter your current 6 digits Zwallet PIN below to continue to the next steps.</p>
            <div className="mx-auto">
              <div className="d-flex justify-content-center gap-3 fw9-input my-5">
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
                <div className="square">
                  <input type="text" className="rounded-3 text-center fs-1" />
                </div>
              </div>
              <Link to="/profile" className="d-grid gap-2">
                <button className="btn btn-primary" type="button">
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ChangePin
