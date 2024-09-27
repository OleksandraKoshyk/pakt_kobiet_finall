const DEFAULT_CITY_NAME = 'Warszawa';
const DEFAULT_LON = 21.0118;
const DEFAULT_LAT = 52.2298;

export function getUserCoords() {
  const defaultCoords = [DEFAULT_LAT, DEFAULT_LON];

  // Сzy przeglądarka obsługuje geolokalizację
  if (!navigator.geolocation) {
    console.warn('Geolokalizacja nie jest obsługiwana przez przeglądarkę. Używam domyślnych współrzędnych.');
    return Promise.resolve(defaultCoords); // Zwróć rozwiązane Promise z domyślnymi współrzędnymi
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve([latitude, longitude]); // Rozwiąż z współrzędnymi użytkownika.
      },
      () => {
        console.warn('Geolokalizacja jest niedostępna. Używam domyślnych wartości.');
        resolve(defaultCoords); // Rozwiąż z domyślnymi współrzędnymi, jeśli geolokalizacja nie powiedzie się.
      }
    );
  });
}