import React from 'react'
import { logout } from '../redux/reducers/user'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { handleClick } from '../redux/reducers/sidebar'
import { FiGrid } from 'react-icons/fi'
import { IconContext } from 'react-icons'
import { FiArrowUp } from 'react-icons/fi'
import { FiPlus } from 'react-icons/fi'
import { FiUser } from 'react-icons/fi'
import { FiLogOut } from 'react-icons/fi'

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const active = useSelector((state) => state.sidebar.active)

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const changePage = (e) => {
    e.preventDefault()
    dispatch(handleClick(e.target.id))
    navigate(`/${e.target.id}`)
  }

  return (
    <div className="col-lg-3 flex-column justify-content-between bg-light fw9-menu-list d-none d-lg-flex">
      <div className="d-flex flex-column gap-5">
        <div className="d-flex gap-4 sidebar-menu align-items-end">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FiGrid />
            </div>
          </IconContext.Provider>
          <h3 id="dashboard" onClick={changePage} className={active === 'dashboard' ? 'active fw-bold' : 'fw9-menu'}>
            Dashboard
          </h3>
        </div>
        <div className="d-flex gap-4 sidebar-menu align-items-end">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FiArrowUp />
            </div>
          </IconContext.Provider>
          <h3 id="search-receiver" onClick={changePage} className={active === 'search-receiver' ? 'active fw-bold' : 'fw9-menu'}>
            Transfer
          </h3>
        </div>
        <div href="top-up-page.html" className="d-flex gap-4 sidebar-menu align-items-end">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FiPlus />
            </div>
          </IconContext.Provider>
          <h3 id="top-up" onClick={changePage} className={active === 'top-up' ? 'active fw-bold' : 'fw9-menu'}>
            Top Up
          </h3>
        </div>
        <div className="d-flex gap-4 fw-bold sidebar-menu align-items-end">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FiUser />
            </div>
          </IconContext.Provider>
          <h3 id="profile" onClick={changePage} className={active === 'profile' ? 'active fw-bold' : 'fw9-menu'}>
            Profile
          </h3>
        </div>
      </div>
      <div>
        <div onClick={onLogout} className=" d-flex gap-4 align-items-end sidebar-menu">
          <IconContext.Provider value={{ size: '2em' }}>
            <div>
              <FiLogOut />
            </div>
          </IconContext.Provider>
          <h3 className="fw9-menu">Log Out</h3>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
