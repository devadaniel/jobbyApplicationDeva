import './index.css'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import FilterGroup from '../FilterGroup'
import JobCards from '../JobCards'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: {},
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentTypesChecked: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getJobCardDetails()
  }

  getJobCardDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {
      searchInput,
      employmentTypesChecked,
      activeSalaryRangeId,
    } = this.state
    const employTypes = employmentTypesChecked.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const jobsCardsUrl = ` https://apis.ccbp.in/jobs?employment_type=${employTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsCardsUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobData = data.jobs.map(eachData => ({
        id: eachData.id,
        title: eachData.title,
        rating: eachData.rating,
        companyLogoUrl: eachData.company_logo_url,
        location: eachData.location,
        jobDescription: eachData.job_description,
        employmentType: eachData.employment_type,
        packagePerAnnum: eachData.package_per_annum,
      }))
      this.setState({
        jobsList: updatedJobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <>
        {jobsList.length > 0 ? (
          <ul className="jobs-list">
            {jobsList.map(eachJob => (
              <JobCards key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobCardDetails()
    }
  }

  renderProfileAndSearchInput = () => {
    const {searchInput} = this.state
    return (
      <>
        <div className="search-box-container">
          <input
            type="search"
            className="search-box"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.onEnterSearchInput}
          />
          <button
            type="button"
            className="search-button"
            data-testid="searchButton"
            onClick={() => this.getJobCardDetails()}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ProfileDetails />
      </>
    )
  }

  renderJobsFailureView = () => (
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
        onClick={() => this.getJobCardDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  updateEmploymentTypesChecked = typeId => {
    const {employmentTypesChecked} = this.state
    let updatedList = employmentTypesChecked
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        eachType => eachType !== typeId,
      )
    } else {
      updatedList = [...updatedList, typeId]
    }

    this.setState({employmentTypesChecked: updatedList}, this.getJobCardDetails)
  }

  updateSalaryRangeId = activeSalaryRangeId =>
    this.setState({activeSalaryRangeId}, this.getJobCardDetails)

  render() {
    const {activeSalaryRangeId, employmentTypesChecked} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-and-filter-group-container">
            {this.renderProfileAndSearchInput()}
            <FilterGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              updateSalaryRangeId={this.updateSalaryRangeId}
              activeSalaryRangeId={activeSalaryRangeId}
              updateEmploymentTypesChecked={this.updateEmploymentTypesChecked}
              employmentTypesChecked={employmentTypesChecked}
            />
          </div>
          {this.renderJobsStatus()}
        </div>
      </>
    )
  }
}

export default Jobs
