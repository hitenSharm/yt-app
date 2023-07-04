import axios from "axios";

const apiLink = "http://localhost:8080/";

export const fetchVideos = async (page, sorted) => {
  try {
    console.log(page);
    let newApiLink = apiLink + "youtube/videos";
    const response = await axios.get(newApiLink, {
      params: {
        page,
        sorted,
      },
    });    
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const changeCron = async (method) => {
  let newApiLink = apiLink + "cron/method";
  const response = await axios.get(newApiLink, {
    params: {
      search: method,
    },
  });
  return response.status;
};
//stop or resume method

export const searchVideos = async (page, sortOrder,searchQuery) => {        
  try {
    let newApiLink = apiLink + "youtube/search";
    const response = await axios.get(newApiLink, {
      params: {
        page,
        sorted:sortOrder,
        q: searchQuery,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
