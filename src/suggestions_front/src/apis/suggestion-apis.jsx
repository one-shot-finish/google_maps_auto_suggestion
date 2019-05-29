import axios from 'axios';

console.log(process.env);
const GET_LOCATIONS = `http://localhost:8000/suggestions`;

export const getLocations = params => axios.get(GET_LOCATIONS, { params });
