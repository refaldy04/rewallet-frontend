import React from 'react'
import '../asset/css/home-page.css'
import Navbar from '../component/Navbar'
import Dropdown from '../component/Dropdown'
import Footer from '../component/Footer'
import graphic from '../asset/img/graphic.png'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProfile, historyTransaction } from '../redux/asyncActions/profile'
import Sidebar from '../component/Sidebar'

const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number)
}

const Card = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const data = useSelector((state) => state.profile.historyTransaction)

  React.useEffect(() => {
    dispatch(historyTransaction({ token, limit: 4 }))
  }, [])

  return (
    <>
      {data ? (
        data.map((user) => (
          <div key={user.id} className="d-flex flex-column mt-3">
            <div className="d-flex align-items-start justify-content-between flex-column flex-xl-row">
              <div className="d-flex align-items-start gap-2">
                <img src={user.picture ? `https://res.cloudinary.com/dwxrkcas3/image/upload/${user.picture}` : '/default-profile-pic.jpg'} alt="user" className="img-fluid profile-pic rounded" />
                <div className="d-flex flex-column justify-content-between">
                  <h5 className="name-history">{user.fullname}</h5>
                  <p className="type-history">{user.type_id === 1 ? 'Transfer' : 'Top Up'}</p>
                </div>
              </div>
              <h3 className={user.type_id === 1 ? 'amount-history fw-bold minus' : 'amount-history fw-bold plus'}>{rupiah(user.amount)}</h3>
            </div>
          </div>
        ))
      ) : (
        <div>data not found</div>
      )}
    </>
  )
}

export const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.user.token)
  const profile = useSelector((state) => state.profile.data)
  const pin = useSelector((state) => state.user.pin)

  React.useEffect(() => {
    if (pin) {
      console.log('ini data user', profile)
      dispatch(getProfile(token))
    } else {
      navigate('/create-pin', { replace: true })
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Dropdown />

        <div className="row">
          <Sidebar />

          <div className="col-lg-9 mt-5 mt-lg-0 d-flex flex-column gap-2">
            <div className="d-flex justify-content-between fw9-balance flex-column flex-lg-row">
              <div>
                <h5 className="text-light">Balance</h5>
                <h1 className="text-light">{rupiah(profile?.balance)}</h1>
                <p className="text-light">{profile?.phone_number}</p>
              </div>
              <div className="d-flex flex-column">
                <button type="button" onClick={() => navigate('/search-receiver')} className="btn btn-outline-secondary fw9-transaction">
                  <i data-feather="arrow-up" className="fw9-menu"></i> Transfer
                </button>
                <button type="button" onClick={() => navigate('/top-up')} className="btn btn-outline-secondary fw9-transaction">
                  <i data-feather="plus" className="fw9-menu"></i> Top Up
                </button>
              </div>
            </div>

            <div className="d-flex gap-2 flex-column flex-lg-row mb-0">
              <div className="fw9-diagram d-flex flex-column col-lg-7 rounded justify-content-between">
                <div className="d-flex flex-column flex-lg-row gap-sm-4 gap-lg-0 justify-content-between">
                  <div className="d-flex flex-column">
                    <i data-feather="arrow-up" className="text-success"></i>
                    <p>Income</p>
                    <h2 className="fs-5">Rp2.120.000</h2>
                  </div>
                  <div className="d-flex flex-column">
                    <i data-feather="arrow-down" className="text-danger"></i>
                    <p>Expense</p>
                    <h2 className="fs-5">Rp1.560.000</h2>
                  </div>
                </div>
                <div className="text-center mt-sm-4 mt-lg-0">
                  <img src={graphic} className="img-fluid" alt="graphic" />
                </div>
              </div>

              <div className="fw9-history d-flex flex-column col-lg-5 rounded">
                <div className="d-flex flex-row justify-content-between">
                  <p className="transaction-history">Transaction History</p>
                  {/* <a href="history-page.html" className="see-all-transaction">
                    See all
                  </a> */}
                </div>

                <Card />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Dashboard
