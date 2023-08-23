import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getCamelCasedData = data => {
    const jobDetails = data.job_details

    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      rating: jobDetails.rating,
      title: jobDetails.title,
      packagePerAnnum: jobDetails.package_per_annum,
      skills: jobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompany: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
    }

    const similarJobs = data.similar_jobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

    return {updatedJobDetails, similarJobs}
  }

  getJobItemDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {updatedJobDetails, similarJobs} = this.getCamelCasedData(data)

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderApiFailureView = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-retry-button"
        type="button"
        onClick={() => this.getJobItemDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <div className="job-card">
          <div className="company-log-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-icon-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-start-icon-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-job-type-salary-container">
            <div className="location-job-container">
              <div className="location-job-type-container">
                <IoLocationSharp className="location" />
                <p className="location-name">{location}</p>
              </div>
              <div className="job-type-container">
                <BsFillBriefcaseFill className="brief-case-icon" />
                <p className="job-title">{employmentType}</p>
              </div>
            </div>
            <p className="package-per-annum">{packagePerAnnum}</p>
          </div>
          <hr className="separator" />
          <div className="job-card-description-container">
            <div className="description-heading-and-company-link-container">
              <h1 className="job-description-heading">Description</h1>
              <a href={companyWebsiteUrl} className="company-link">
                Visit
                <FiExternalLink className="external-link-logo" />
              </a>
            </div>
            <p className="job-card-description">{jobDescription}</p>
          </div>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-items">
            {skills.map(eachItem => {
              const {imageUrl, name} = eachItem
              return (
                <li className="list-items">
                  <img src={imageUrl} alt={name} className="skill-image" />
                  <p className="skill-name">{name}</p>
                </li>
              )
            })}
          </ul>
          <h1 className="life-at-company">Life at Company</h1>
          <div className="company-life-container">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachJob => (
            <SimilarJobItem key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetailsPage() {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-page">
        <Header />
        {this.renderJobDetailsPage()}
      </div>
    )
  }
}

export default JobItemDetails
