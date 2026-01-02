import axios from "axios";

export const DeviceId = (): string => {
  const device_id = localStorage.getItem("merger_app_device");

  if (!device_id) {
    const new_device = crypto.randomUUID();
    localStorage.setItem("merger_app_device", new_device);

    return new_device;
  } else {
    return device_id;
  }
};

export const DeviceLocation = async (): Promise<{
  lat: number | null;
  long: number | null;
}> => {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        async () => {
          const getDeviceLoc = await axios.get("https://ipinfo.io/json");

          if (getDeviceLoc.data.loc) {
            const lat = getDeviceLoc.data.loc.split(",")[0];
            const long = getDeviceLoc.data.loc.split(",")[1];
            reject({
              lat,
              long,
            });
          } else {
            reject({
              lat: null,
              long: null,
            });
          }
        },
        {
          timeout: 10000,
        }
      );
    });
  } else {
    const getDeviceLoc = await axios.get("https://ipinfo.io/json");

    if (getDeviceLoc.data) {
      const lat = getDeviceLoc.data.loc.split(",")[0];
      const long = getDeviceLoc.data.loc.split(",")[1];

      return {
        lat,
        long,
      };
    } else {
      return {
        lat: null,
        long: null,
      };
    }
  }
};
