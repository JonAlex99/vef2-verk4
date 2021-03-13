// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';
import { get, set } from './cache.js';
import { timerStart, timerEnd } from './time.js';

// kannski setja í .env
export const router = express.Router();

function getUSGS(type, period) {
  return `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
}

async function fetchUSGS(site) {
  const data = await fetch(site);
  const jsonData = await data.json();

  return jsonData;
}

async function getData(req, res) {
  const { type, period } = req.query;

  const site = getUSGS(type, period);
  const cacheKey = `type:${type}-period:${period}`;
  const timer = timerStart();

  let quakes;

  const cached = await get(cacheKey);

  if (cached) {
    quakes = cached;
  } else {
    quakes = await fetchUSGS(site);
    set(cacheKey, quakes, 60); // Geymi cache í 60 sek vegna set en ekki mset (cache.js)
  }

  const endTimer = timerEnd(timer);

  const results = {
    data: quakes,
    info: {
      time: endTimer,
      cache: cached != null,
    },
  };

  return res.json(results);
}

router.get('/', getData);
