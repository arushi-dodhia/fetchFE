import React from 'react';
import { Heart } from 'lucide-react';
import '../styles/Card.css';

const card = ({ dog, isFavorite, onToggleFavorite }) => {
  return (
    <div className="dog-card">
      <div className="dog-image-container">
        <img
          src={dog.img}
          alt={dog.name}
          className="dog-image"
        />
        <button
          onClick={() => onToggleFavorite(dog.id)}
          className="favorite-button"
        >
          <Heart className={`heart-icon ${isFavorite ? 'favorited' : ''}`} />
        </button>
      </div>
      
      <div className="dog-info">
        <h3 className="dog-name">{dog.name}</h3>
        <p className="dog-breed">{dog.breed}</p>
        <p className="dog-details">{dog.age} years • {dog.zip_code}</p>
      </div>
    </div>
  );
};

export default card;