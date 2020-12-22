function parseJSON(response) {
  return response.json();
}

function checkResponse(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

export default async function getData(url) {
  const rez = await fetch(url)
    .then(checkResponse)
    .then(parseJSON)
    .catch(() => null);

  return rez;
}
