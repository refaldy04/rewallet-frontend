import React, { useState } from 'react'
import '../asset/css/top-up.css'
import Navbar from '../component/Navbar'
import Footer from '../component/Footer'
import Dropdown from '../component/Dropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { topup } from '../redux/asyncActions/topup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../component/Sidebar'
import { historyTransaction } from '../redux/asyncActions/profile'

function MyVerticallyCenteredModal(props) {
  const [form, setForm] = useState({ amount: '' })

  const navigate = useNavigate()

  const handleChangeText = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)

  const onTopup = (event) => {
    event.preventDefault()
    dispatch(topup({ form, token, cb: () => dispatch(historyTransaction({ token, limit: 4 })) }))
    navigate('/dashboard')
  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">TopUp Here</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onTopup}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* <Form.Label>Email address</Form.Label> */}
            <Form.Control name="amount" type="text" placeholder="0.0" onChange={handleChangeText} className="text-secondary fw9-input-money text-center fs-1" />
            <Form.Control.Feedback type="invalid" className="text-center"></Form.Control.Feedback>
            {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">TopUp</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export const TopUp = () => {
  const [modalShow, setModalShow] = React.useState(false)

  return (
    <>
      <Navbar />

      <main>
        <Dropdown />

        <div className="d-flex gap-3">
          <Sidebar />

          <div className="col-lg-9 col-12 mt-5 mt-lg-0 d-flex flex-column gap-4 bg-light rounded-4 fw9-input-amount">
            <p className="transfer-header">You Can Topup Here</p>
            <Button variant="primary" onClick={() => setModalShow(true)}>
              TopUp
            </Button>

            <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
            <p className="transfer-header mt-5">Or You Can Topup via ATM</p>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>1 </span> Go to the nearest ATM or you can use E-Banking.
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>2 </span> Type your security number on the ATM or E-Banking.
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>3 </span> Select “Transfer” in the menu
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>4 </span> Type the virtual account number that we provide you at the top.
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>5 </span> Type the amount of the money you want to top up.
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>6 </span> Read the summary details
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>7 </span> Press transfer / top up
                </h5>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2 fw9-detail">
              <div className="d-flex flex-column justify-content-between">
                <h5 className="name-history">
                  <span>8 </span> You can see your money in Zwallet within 3 hours.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default TopUp
