import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { logout } from '../../actions/auth'

export const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

    const authLink = (
        <ul>
            <li><Link onClick={logout} to="#!">
                <i className="fas fa-sign-out-alt"></i>{' '}
                <span className="hide-sm">Logout</span>
            </Link>
            </li>
        </ul>
    )

    const guestLink = (
        <ul>
            <li><Link to="#!">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    return (
        <div>
            <nav className="navbar bg-dark">
                <h1>
                    <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
                </h1>
                {!loading && (<Fragment>{isAuthenticated ? authLink : guestLink}</Fragment>)}
            </nav>
        </div>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapsStateToProps = state => ({
    auth: state.auth
})

export default connect(mapsStateToProps, { logout })(Navbar)