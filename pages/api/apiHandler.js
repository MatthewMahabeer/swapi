import axios from 'axios';

export const node = axios.create({
  baseURL: "https://swapi.dev/api/",
  headers: {
    "Content-type": "application/json",
  },
});

export const fetchPeople = async () =>
  await fetch("https://swapi.dev/api/people/").then((res) => res.json());

export const getPlanets = async () =>
  await fetch("https://swapi.dev/api/planets/").then((res) => res.json());


export const getSpecies = async () =>
  await fetch("https://swapi.dev/api/species/").then((res) => res.json());

export const filterPeople = async (name) => await fetch(`https://swapi.dev/api/people/?search=${name}`).then((res) => res.json());

export const getVehicle = async (url) => await fetch(url).then((res) => res.json());