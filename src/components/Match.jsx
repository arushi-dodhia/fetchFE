import React from 'react';
import '../styles/Match.css';

const Match = ({ matchedDog, onClose }) => {
  if (!matchedDog) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img
          src={matchedDog.img}
          alt={matchedDog.name}
          className="match-image"
        />
        
        <h2 className="match-title">Meet {matchedDog.name}</h2>
        <p className="match-description">
          This {matchedDog.age}-year-old {matchedDog.breed} is ready to meet you. 
        </p>
        
        <button
          onClick={onClose}
          className="connect-button"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default Match;