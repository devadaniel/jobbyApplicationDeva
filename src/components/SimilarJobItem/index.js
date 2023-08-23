import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="job-card">
      <div className="company-log-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="job-description-heading">Description</h1>
      <p className="job-card-description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobCard
