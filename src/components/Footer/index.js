import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram, FiTwitter} from 'react-icons/fi'

export default function Footer() {
  return (
    <div>
      <h1 className="footer-heading">
        COVID19<span className="footer-heading-span-element">INDIA</span>
      </h1>
      <p className="footer-description">
        we stand with everyone fighting on the front lines
      </p>
      <div className="icons-container">
        <VscGithubAlt className="footer-icon" />
        <FiInstagram className="footer-icon" />
        <FiTwitter className="footer-icon" />
      </div>
    </div>
  )
}
