import axios from "axios";

export const DeviceInfo = async (user_agent: string) => {
  try {
    // Parsing User agent string
    const parseUaRes = await axios.post(
      "https://api.apicagent.com",
      {
        ua: user_agent,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return parseUaRes.data;
  } catch (error) {
    console.log("DeviceInfo_Error: ", error);
    return null;
  }
};
