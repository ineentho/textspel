import React from 'react'
import { browserHistory } from 'react-router'
import AccountAPI from 'common/api/account.js'

export default class RegisterPage extends React.Component {

  constructor () {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label htmlFor='username'>
            Username:
          </label>
          <br />
          <input
            className='input'
            type='text'
            id='username'
            value={this.state.username}
            onChange={this.updateUsername.bind(this)} />
          <br />
          <label htmlFor='password'>
            Password:
          </label>
          <br />
          <input
            className='input'
            type='password'
            id='password'
            value={this.state.password}
            onChange={this.updatePassword.bind(this)} />
          <br />
          <label htmlFor='password-confirm'>
            Confirm Password:
          </label>
          <br />
          <input
            className='input'
            type='password'
            id='password'
            value={this.state.password}
            onChange={this.updatePassword.bind(this)} />
          <br />
          <div className='button-center'>
            <input className='button' type='submit' value='Register' />
          </div>
        </form>
      </div>
    )
  }

  updateUsername (e) {
    this.setState(Object.assign(this.state, {
      username: e.target.value
    }))
  }

  updatePassword (e) {
    this.setState(Object.assign(this.state, {
      password: e.target.value
    }))
  }

  onSubmit (e) {
    e.preventDefault()
    return Promise.resolve((async resolve => {
      const response = await AccountAPI.register(this.state.username, this.state.password)

      if (response.json.success) {
        browserHistory.push('/login')
      } else {
        window.alert(`Could not create account: ${response.json.error}`)
      }
      resolve()
    })()).catch(err => console.error(err.stack || err))
  }

}
