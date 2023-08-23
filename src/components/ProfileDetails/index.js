import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProfileDetails extends Component {
  state = {
    profileData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateProfileData = {
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
        profileImageUrl: data.profile_details.profile_image_url,
      }
      this.setState({
        profileData: updateProfileData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileData = () => {
    const {profileData} = this.state
    const {profileImageUrl, shortBio, name} = profileData
    return (
      <div className="profile-card-container">
        <img src={profileImageUrl} alt="profile" className="profile" />
        <h1 className="name-heading">{name}</h1>
        <p className="profile-role">{shortBio}</p>
      </div>
    )
  }

  retryProfileView = () => {
    this.getProfileDetails()
  }

  renderProfileFailure = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.retryProfileView}
      >
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileData()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="profile-container">{this.renderProfileStatus()}</div>
        <hr className="separator" />
      </>
    )
  }
}
export default ProfileDetails
