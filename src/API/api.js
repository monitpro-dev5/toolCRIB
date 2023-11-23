// api.js (Custom API Fetch Hook)
import { useState, useEffect } from 'react';

//export const BASE_API_URL_Web = "http://localhost:5269/api/ToolCrib/";

//export const BASE_API_URL_Web = "http://ec2-35-91-31-59.us-west-2.compute.amazonaws.com/MCF_ToolCrib/api/ToolCrib/"

export const BASE_API_URL_Web = "http://54.185.173.37/MCF_ToolCrib/api/ToolCrib/"

//export const BASE_API_URL_Web = "http://10.11.20.27/ToolcribApi/api/ToolCrib/"

function useApi(endpoint) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setData(error);
      });
  }, [endpoint]);

  return { data };
}

export default useApi;
