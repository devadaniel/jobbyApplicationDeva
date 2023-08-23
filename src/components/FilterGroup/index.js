import './index.css'

const FilterGroup = props => {
  const {updateEmploymentTypesChecked, updateSalaryRangeId} = props

  const renderEmploymentTypesList = () => {
    const {employmentTypesList} = props
    return (
      <ul className="employ-type-list">
        <h1 className="employ-type-heading">Type of Employment</h1>
        {employmentTypesList.map(eachType => (
          <li className="list-items" key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id="checkbox"
              onChange={() =>
                updateEmploymentTypesChecked(eachType.employmentTypeId)
              }
            />
            <label className="label-type" htmlFor="checkbox">
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  const renderSalaryRanges = () => {
    const {salaryRangesList} = props
    return (
      <ul className="salary-list-items">
        <h1 className="salary-range-heading">Salary Range</h1>
        {salaryRangesList.map(eachRange => (
          <li className="salary-items" key={eachRange.salaryRangeId}>
            <input
              type="radio"
              className="radio-input"
              id="radio"
              onChange={() => updateSalaryRangeId(eachRange.salaryRangeId)}
            />
            <label htmlFor="radio" className="radio-label">
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="filter-container">
      {renderEmploymentTypesList()}
      <hr className="separator" />
      {renderSalaryRanges()}
    </div>
  )
}

export default FilterGroup
