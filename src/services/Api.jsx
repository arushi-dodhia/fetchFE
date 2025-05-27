export const api = {
  login: async (name, email) => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email })
    });
    return response.ok;
  },

  logout: async () => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  },

  getBreeds: async () => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/breeds`, {
      credentials: 'include'
    });
    return response.json();
  },

  searchDogs: async (params) => {
    const url = new URL(`https://frontend-take-home-service.fetch.com/dogs/search`);
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
      const error = await response.text(); 
      throw new Error(`Search failed: ${response.status} ${error}`);
    }
    
    return response.json();
    
  },

  getDogs: async (ids) => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(ids)
    });
    return response.json();
  },

  getMatch: async (ids) => {
    const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(ids)
    });
    return response.json();
  }
};