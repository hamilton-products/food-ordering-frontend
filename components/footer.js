import React from 'react';

const Footer = ({ facebook, twitter, tiktok, youtube, instagram }) => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>© Hamilton. All rights reserved.</p>
      <div style={iconContainerStyle}>
        {facebook && (
          <a href={facebook} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.99 3.66 9.1 8.44 9.88v-7.02H8.1v-2.86h2.34V9.67c0-2.32 1.41-3.59 3.48-3.59.99 0 1.84.07 2.09.1v2.42h-1.44c-1.13 0-1.35.54-1.35 1.33v1.74h2.7l-.35 2.86h-2.35v7.02C18.34 21.1 22 16.99 22 12z"/>
            </svg>
          </a>
        )}
        {twitter && (
          <a href={twitter} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46 6.03c-.77.34-1.6.57-2.47.67a4.3 4.3 0 0 0 1.88-2.37c-.82.49-1.73.84-2.7 1.04a4.29 4.29 0 0 0-7.3 3.92 12.18 12.18 0 0 1-8.84-4.48 4.29 4.29 0 0 0 1.33 5.72 4.27 4.27 0 0 1-1.94-.54v.06a4.29 4.29 0 0 0 3.44 4.21 4.31 4.31 0 0 1-1.94.07 4.29 4.29 0 0 0 4.01 2.98A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.57 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.69 8.69 0 0 0 22.46 6.03z"/>
            </svg>
          </a>
        )}
        {tiktok && (
          <a href={tiktok} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.18 2h2.82a6.09 6.09 0 0 0 3.65 3.65v2.6a7.97 7.97 0 0 1-4.47-1.39V15.8a4.84 4.84 0 1 1-2.4-4.14V4.34H12.2V2z"/>
            </svg>
          </a>
        )}
        {youtube && (
          <a href={youtube} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.8 8.08a2.7 2.7 0 0 0-1.9-1.9C18.57 6 12 6 12 6s-6.57 0-7.9.18a2.7 2.7 0 0 0-1.9 1.9A28.52 28.52 0 0 0 2 12a28.52 28.52 0 0 0 .2 3.92 2.7 2.7 0 0 0 1.9 1.9c1.33.18 7.9.18 7.9.18s6.57 0 7.9-.18a2.7 2.7 0 0 0 1.9-1.9c.18-1.33.18-3.92.18-3.92s0-2.59-.18-3.92zM10 15.27v-6.54L15.27 12 10 15.27z"/>
            </svg>
          </a>
        )}
        {instagram && (
          <a href={instagram} target="_blank" rel="noopener noreferrer" style={iconStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.16c3.2 0 3.584.012 4.849.07 1.259.057 2.157.247 2.907.53a5.92 5.92 0 0 1 2.17 1.41 5.92 5.92 0 0 1 1.41 2.17c.283.75.473 1.648.53 2.907.058 1.265.07 1.649.07 4.849s-.012 3.584-.07 4.849c-.057 1.259-.247 2.157-.53 2.907a5.92 5.92 0 0 1-1.41 2.17 5.92 5.92 0 0 1-2.17 1.41c-.75.283-1.648.473-2.907.53-1.265.058-1.649.07-4.849.07s-3.584-.012-4.849-.07c-1.259-.057-2.157-.247-2.907-.53a5.92 5.92 0 0 1-2.17-1.41 5.92 5.92 0 0 1-1.41-2.17c-.283-.75-.473-1.648-.53-2.907C2.172 15.584 2.16 15.2 2.16 12s.012-3.584.07-4.849c.057-1.259.247-2.157.53-2.907a5.92 5.92 0 0 1 1.41-2.17 5.92 5.92 0 0 1 2.17-1.41c.75-.283 1.648-.473 2.907-.53C8.416 2.172 8.8 2.16 12 2.16zm0 1.686c-3.171 0-3.548.012-4.804.07-1.139.053-1.822.241-2.25.401-.56.212-.956.476-1.372.892-.416.416-.68.812-.892 1.372-.16.428-.348 1.111-.401 2.25-.058 1.256-.07 1.633-.07 4.804s.012 3.548.07 4.804c.053 1.139.241 1.822.401 2.25.212.56.476.956.892 1.372.416.416.812.68 1.372.892.428.16 1.111.348 2.25.401 1.256.058 1.633.07 4.804.07s3.548-.012 4.804-.07c1.139-.053 1.822-.241 2.25-.401.56-.212.956-.476 1.372-.892.416-.416.68-.812.892-1.372.16-.428.348-1.111.401-2.25.058-1.256.07-1.633.07-4.804s-.012-3.548-.07-4.804c-.053-1.139-.241-1.822-.401-2.25-.212-.56-.476-.956-.892-1.372-.416-.416-.812-.68-1.372-.892-.428-.16-1.111-.348-2.25-.401-1.256-.058-1.633-.07-4.804-.07zm0 3.837a5.625 5.625 0 1 1 0 11.25 5.625 5.625 0 0 1 0-11.25zm0 1.685a3.94 3.94 0 1 0 0 7.88 3.94 3.94 0 0 0 0-7.88zm5.999-2.045a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/>
            </svg>
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
