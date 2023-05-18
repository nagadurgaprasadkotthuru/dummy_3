import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const nationalStats = {
  activeCases: 0,
  confirmedCases: 0,
  recoveredCases: 0,
  deceasedCases: 0,
}

export default class Home extends Component {
  state = {apiStatus: apiStatusConstants.success, stats: '', statesList: []}

  componentDidMount() {
    this.getDate()
  }

  getDate = async () => {
    const {statesList} = this.props
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const requestUrl = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(requestUrl)
    const data = await response.json()
    if (response.ok) {
      statesList.map(eachState => {
        const stateCode = eachState.state_code
        const state = data[stateCode]
        const {total} = state
        const {confirmed, recovered, deceased} = total
        const active = confirmed - (recovered + deceased)
        nationalStats.confirmedCases += confirmed
        nationalStats.recoveredCases += recovered
        nationalStats.deceasedCases += deceased
        total.active = active
        return {stateCode: state}
      })
      nationalStats.activeCases =
        nationalStats.confirmedCases -
        (nationalStats.recoveredCases + nationalStats.deceasedCases)
      this.setState({
        stats: data,
        statesList,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderNationalStats = () => (
    <ul className="national-stats-container">
      <li className="national-stats-list-element">
        <h4 className="confirmed-heading">Confirmed</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333471/check-mark_1_1x_sm_e9wxjd.png"
        />
        <p className="confirmed-cases">{nationalStats.confirmedCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="active-heading">Active</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333508/protection_2_1x_sm_exkepc.png"
        />
        <p className="active-cases">{nationalStats.activeCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="recovered-heading">Recovered</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333495/recovered_1_1x_sm_osgwaq.png"
        />
        <p className="recovered-cases">{nationalStats.recoveredCases}</p>
      </li>
      <li className="national-stats-list-element">
        <h4 className="deceased-heading">Deceased</h4>
        <img
          className="image"
          alt="logo"
          src="https://res.cloudinary.com/dfddyuqkb/image/upload/v1684333483/breathing_1_1x_sm_giojfp.png"
        />
        <p className="deceased-cases">{nationalStats.deceasedCases}</p>
      </li>
    </ul>
  )

  renderStateStatsTableElement = (state, stateName, stateCode) => {
    const {total} = state
    const {confirmed, active, recovered, deceased, tested} = total
    return (
      <li className="table-list-element" key={stateCode}>
        <div className="state-name-container">
          <p className="state-name">{stateName}</p>
        </div>
        <div className="state-confirmed-cases-container">
          <p className="state-confirmed-cases">{confirmed}</p>
        </div>
        <div className="state-active-cases-container">
          <p className="state-active-cases">{active}</p>
        </div>
        <div className="state-recovered-cases-container">
          <p className="state-recovered-cases">{recovered}</p>
        </div>
        <div className="state-deceased-cases-container">
          <p className="state-deceased-cases">{deceased}</p>
        </div>
        <div className="state-tested-container">
          <p className="state-tested">{tested}</p>
        </div>
      </li>
    )
  }

  renderStateStatsView = () => {
    const {stats, statesList} = this.state
    return (
      <ul className="states-table-container">
        <li className="table-header-list-element">
          <div className="states/ut-heading-icons-container">
            <h3 className="states/ut">States/UT</h3>
            <button
              className="ascending-button"
              type="button"
              data-testid="ascendingSort"
            >
              <FcGenericSortingAsc className="sorting-icon" />
            </button>
            <button
              className="descending-button"
              type="button"
              data-testid="descendingSort"
            >
              <FcGenericSortingDesc className="sorting-icon" />
            </button>
          </div>
          <div className="confirmed-table-heading-container">
            <h3 className="confirmed">Confirmed</h3>
          </div>
          <div className="confirmed-table-heading-container">
            <h3 className="confirmed">Active</h3>
          </div>
          <div className="confirmed-table-heading-container">
            <h3 className="confirmed">Recovered</h3>
          </div>
          <div className="confirmed-table-heading-container">
            <h3 className="confirmed">Deceased</h3>
          </div>
        </li>
        {statesList.map(eachState => {
          const stateCode = eachState.state_code
          const stateName = eachState.state_name
          const state = stats[stateCode]
          return this.renderStateStatsTableElement(state, stateName, stateCode)
        })}
      </ul>
    )
  }

  renderSuccessView = () => (
    <div className="home-content-container">
      <div className="search-icon-element-container">
        <BsSearch className="search-icon" />
        <input
          className="search-element"
          type="search"
          placeholder="Enter the State"
        />
      </div>
      {this.renderNationalStats()}
      {this.renderStateStatsView()}
      <Footer />
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#007bff" height="32px" width="32px" />
    </div>
  )

  renderSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-bg-container">
        <Header />
        {this.renderSwitchView()}
      </div>
    )
  }
}
