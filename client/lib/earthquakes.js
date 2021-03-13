export async function fetchEarthquakes(type, period) {
  // TODO sækja gögn frá proxy þjónustu
  const site = new URL('/proxy', window.location);
  let result = '';

  if (type) {
    site.searchParams.append('type', type);
  }

  if (period) {
    site.searchParams.append('period', period);
  }

  try {
    result = await fetch(site);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
