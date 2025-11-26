const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // parse JSON body first — server includes detailed info in the body
  const jsonResponse = await res.json().catch(() => null);
  if (res.ok) {
    return jsonResponse;
  }

  // return a structured error that preserves the server's JSON body
  throw { name: 'servicesError', message: jsonResponse };
}

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    // POST order object to checkout endpoint
    const url = `${baseURL}checkout`;
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    const response = await fetch(url, options);
    return convertToJson(response);
  }
}
