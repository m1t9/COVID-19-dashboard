export default async function getData(url) {
  const rez = await fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response;
      }

      throw new Error(response.statusText);
    })
    .then((response) => response.json())
    .catch(() => null);

  return rez;
}
