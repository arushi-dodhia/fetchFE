import React, { useState, useEffect } from 'react';
import { Search, LogOut } from 'lucide-react';
import { api } from '../services/Api';
import Card from './Card';
import Match from './Match';
import '../styles/Search.css';

const search = ({ user, onLogout }) => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sortField, setSortField] = useState('breed');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [nextCursor, setNextCursor] = useState('');
  const [prevCursor, setPrevCursor] = useState('');

  const pageSize = 25;

  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedList = await api.getBreeds();
        setBreeds(breedList.sort());
      } catch (err) {
        console.error('Failed to load breeds:', err);
      }
    };
    loadBreeds();
    searchDogs(); 
  }, []);

  const searchDogs = async (from = '') => {
    setLoading(true);
    try {
      const searchParams = {
        size: pageSize,
        sort: `${sortField}:${sortOrder}`,
        ...(selectedBreeds.length > 0 && { breeds: selectedBreeds }),
        ...(ageMin && { ageMin: parseInt(ageMin) }),
        ...(ageMax && { ageMax: parseInt(ageMax) }),
        ...(from && { from })
      };

      const searchResults = await api.searchDogs(searchParams);
      const dogDetails = await api.getDogs(searchResults.resultIds);
      
      setDogs(dogDetails);
      setTotalResults(searchResults.total);
      setNextCursor(searchResults.next || '');
      setPrevCursor(searchResults.prev || '');
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    searchDogs();
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCurrentPage(prev => prev + 1);
      const cursor = nextCursor.split('from=')[1]?.split('&')[0];
      searchDogs(cursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      setCurrentPage(prev => Math.max(0, prev - 1));
      const cursor = prevCursor.split('from=')[1]?.split('&')[0];
      searchDogs(cursor);
    }
  };

  const toggleFavorite = (dogId) => {
    setFavorites(prev => 
      prev.includes(dogId)
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };

  const handleGetMatch = async () => {
    if (favorites.length === 0) return;

    try {
      const matchResult = await api.getMatch(favorites);
      const matchedDogData = await api.getDogs([matchResult.match]);
      setMatchedDog(matchedDogData[0]);
    } catch (err) {
      console.error('Failed to get match:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="search-screen">
      <header className="header">
        <div className="header-container">
          <h1 className="logo">fetch</h1>
          
          <div className="header-actions">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle"
            >
              <Search className="icon" />
              Filter
            </button>
            
            {favorites.length > 0 && (
              <button
                onClick={handleGetMatch}
                className="match-button"
              >
                Find Match ({favorites.length})
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              <LogOut className="icon" />
              {user.name}
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        {showFilters && (
          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Breed</label>
                <select
                  multiple
                  value={selectedBreeds}
                  onChange={(e) => setSelectedBreeds(Array.from(e.target.selectedOptions, option => option.value))}
                  className="breed-select"
                  size="4"
                >
                  {breeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Min Age</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="age-input"
                  placeholder="Any"
                  min="0"
                />
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Max Age</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="age-input"
                  placeholder="Any"
                  min="0"
                />
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Sort</label>
                <div className="sort-controls">
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="sort-select"
                  >
                    <option value="breed">Breed</option>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="sort-select"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="apply-filters-button"
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
          </div>
        )}

        <div className="results-bar">
          <p className="results-count">
            {totalResults} dogs
          </p>
          
          {(prevCursor || nextCursor) && (
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={!prevCursor || loading}
                className="pagination-button"
              >
                previous
              </button>
              
              <button
                onClick={handleNextPage}
                disabled={!nextCursor || loading}
                className="pagination-button"
              >
                next
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="dogs-grid">
            {dogs.map(dog => (
              <Card
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {dogs.length === 0 && !loading && (
          <div className="empty-state">
            <p>No dogs found</p>
          </div>
        )}
      </div>

      <Match 
        matchedDog={matchedDog} 
        onClose={() => setMatchedDog(null)} 
      />
    </div>
  );
};

export default search;