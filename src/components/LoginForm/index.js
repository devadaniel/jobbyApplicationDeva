import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitErrorMsg: false,
    errorMsg: '',
  }

  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitErrorMsg = errorMsg => {
    this.setState({showSubmitErrorMsg: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitErrorMsg(data.error_msg)
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  render() {
    const {username, password, showSubmitErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <div className="login-form-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <div className="input-container">
            <form className="form-container" onSubmit={this.submitForm}>
              <label htmlFor="username" className="label">
                USERNAME
              </label>
              <input
                type="text"
                className="username"
                id="username"
                value={username}
                placeholder="Username"
                onChange={this.onChangeUsername}
              />
              <label htmlFor="password" className="label-password">
                PASSWORD
              </label>
              <input
                type="password"
                className="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
              />
              <button className="login-button" type="submit">
                Login
              </button>
              {showSubmitErrorMsg && <p className="error-msg">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
