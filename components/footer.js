import React from 'react';
import { FaFacebook, FaTwitter, FaTiktok, FaYoutube, FaInstagram } from 'react-icons/fa';

const Footer = ({ facebook, twitter, tiktok, youtube, instagram }) => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>© Hamilton. All rights reserved.</p>
      <div style={iconContainerStyle}>
        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <FaFacebook />
          </a>
        )}
        {twitter && (
          <a href={twitter} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <FaTwitter />
          </a>
        )}
        {tiktok && (
          <a href={tiktok} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <FaTiktok />
          </a>
        )}
        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <FaYoutube />
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <FaInstagram />
          </a>
        )}
      </div>
    </footer>
  );
};

const footerStyle = {
  textAlign: 'center',
  padding: '15px 10px',
  position:"relative",
  backgroundColor: '#121212', // Dark background
  borderTop: '1px solid #333', // Subtle border
};

const textStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#fff', // White text for contrast
};

const iconContainerStyle = {
  position:"absolute",
  right:"30px",
  top:"15px",
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
};

const iconStyle = {
  color: '#ccc', // Light gray icons for subtlety
  fontSize: '20px',
  textDecoration: 'none',
  transition: 'color 0.3s',
};

const iconHoverStyle = {
  color: '#fff', // White on hover
};

export default Footer;
