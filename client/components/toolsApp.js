import React from 'react'
import { Link } from 'react-router'

export default class extends React.Component {
  componentWillMount () {
    this.forceUpdate()
  }

  render () {
    return (
      <div>
        <div>
          <div className='links'>
            <div className='leftlinks'>
            </div>
            <div className='middlelinks'>
              <Link to='/'>
                <img className='title' src='/client/png/title.png' />
              </Link>
            </div>
            <div className='rightlinks'>
            </div>
          </div>
        </div>
        <div>
          <ul>
            <li>
              <Link to='/tools/itembrowser'> Item Browser
              </Link>
            </li>
            <li>
              <Link to='/tools/itemgen'> Item Gen
              </Link>
            </li>
          </ul>
          {this.props.children}
        </div>
      </div>
    )
  }
}
