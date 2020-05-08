import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import spinner from '../../img/spinner.gif'

const Spinner = props => (
    <Fragment>
        <img
            src={spinner}
            style={{ width: '200px', margin: 'auto', display: 'block' }}
            alt='loading'
        />
    </Fragment>
)

Spinner.propTypes = {

}

export default Spinner
