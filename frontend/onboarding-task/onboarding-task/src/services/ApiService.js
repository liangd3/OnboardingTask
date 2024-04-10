import axios from 'axios';

const baseUri = "https://onboardingtaskapi.azurewebsites.net/api";


const request = async (url, method, data = null) => {
  try {
    // Configuration for the Axios request
    const config = {
      method: method,
      url: `${baseUri}/${url}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // Make the API call using Axios
    const response = await axios(config);

    // Check if the response was 204 No Content, return null if so
    if (response.status === 204) {
      return null;
    }

    // Return the response data
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 400) {
        // get the bad request response and alert the user
        alertUser(error.response.data.errors);
        return false;
      } else {
        throw new Error(`API call failed with status ${error.response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API request error: No response received", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API request error:", error.message);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
};

function createAlertMessage(errors) {
  let messages = [];
  for (const [key, value] of Object.entries(errors)) {
      // For each field with errors, create a message.
      let message = `${key}: ${value[0]}`;
      messages.push(message);
  }
  // Combine messages into a single string, separated by new lines.
  return messages.join('\n');
}

function alertUser(errors) {
  const message = createAlertMessage(errors);
  alert(message); // Browser's alert function.
}



// Exported function to perform a GET request
export const get = (url) => {
  try {
    return request(url, "GET");
  } catch (error) {
    console.error("Issue with the request:", error.message);
    throw error;
  }
};

// Exported function to perform a POST request with data
export const post = (url, data) => {
  try {
    return request(url, "POST", data);
  } catch (error) {
    console.error("Issue with the request:", error.message);
    throw error;
  }
};

// Exported function to perform a PUT request with data
export const put = (url, data) => {
  try {
    return request(url, "PUT", data);
  } catch (error) {
    console.error("Issue with the request:", error.message);
    throw error;
  }
};

// Exported function to perform a DELETE request
export const del = (url) => {
  try {
    return request(url, "DELETE");
  } catch (error) {
    console.error("Error in delete request:", error.message);
    throw error;
  }
};
