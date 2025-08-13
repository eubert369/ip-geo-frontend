import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL || "No API URL set";

interface GeoInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org?: string;
  postal?: string;
  timezone?: string;
  readme?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [ip, setIp] = useState<string>("");
  const [geoData, setGeoData] = useState<GeoInfo | null>(null);
  const [searchedGeoData, setSearchedGeoData] = useState<GeoInfo | null>(null);
  const [history, setHistory] = useState<GeoInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputIP, setInputIP] = useState<string>("");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [failedFetchingGep, setFailedFetchingGep] = useState<boolean>(false);
  const [invalidIp, setInvalidIp] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token == null) {
      navigate("/");
    }
    setToken(`${token}`);
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(`${apiUrl}auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to logout");
      sessionStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("error logging out:", error);
    }
  };

  const isValidIp = (ip: string): boolean => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){2}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
    const ipv6Regex = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const getUserIp = async (): Promise<string | null> => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data: { ip: string } = await res.json();
      setIp(data.ip);
      return data.ip;
    } catch (error) {
      console.error("Error getting IP:", error);
      return null;
    }
  };

  const getGeoInfo = async (ipAddress: string): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(`https://ipinfo.io/${ipAddress}/geo`);
      if (!res.ok) throw new Error("Failed to fetch geo info");
      const data: GeoInfo = await res.json();
      setGeoData(data);
    } catch (error) {
      console.error("Error getting Geo info:", error);
      setFailedFetchingGep(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${apiUrl}history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data: GeoInfo[] = await res.json();
      setHistory(data);
      console.log("request:", res);
      console.log("token:", token);
    } catch (error) {
      console.error("Error Fetch history:", error);
    }
  };

  useEffect(() => {
    if (token.length > 0) {
      fetchHistory();
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      const userIp = await getUserIp();
      if (userIp) {
        await getGeoInfo(userIp);
      }
    })();
  }, []);

  const searchIp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoadingSearch(true);
      setFailedFetchingGep(false);
      setInvalidIp(false);

      if (!isValidIp(inputIP)) {
        setInvalidIp(true);
        throw new Error("Invalid IP Address");
      }

      const res = await fetch(`https://ipinfo.io/${inputIP}/geo`);
      if (!res.ok) throw new Error("Failed to fetch geo info");
      const data: GeoInfo = await res.json();
      setSearchedGeoData(data);

      const setHistory = await fetch(`${apiUrl}history/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!setHistory.ok) throw new Error("Failed to save search to history");
      const response = await setHistory.json();
      console.log(response);

      fetchHistory();
    } catch (error) {
      console.error("Error getting Geo info:", error);
      setFailedFetchingGep(true);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="w-full h-fit px-5 py-3 flex items-center justify-end">
        <button
          className="px-3 py-1 border rounded-md cursor-pointer hover:scale-110"
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div className="bg-gray-200 w-full px-5 py-3 flex-grow flex flex-wrap justify-center items-center gap-6">
        <div className="bg-white w-fit h-fit p-3 rounded-lg">
          {loading && <p>Loading...</p>}

          {geoData && (
            <div>
              <h2>
                <span className="font-bold">Your IP:</span> {geoData.ip}
              </h2>
              <p>
                <span className="font-bold">City:</span> {geoData.city}
              </p>
              <p>
                <span className="font-bold">Region:</span> {geoData.region}
              </p>
              <p>
                <span className="font-bold">Country:</span> {geoData.country}
              </p>
              <p>
                <span className="font-bold">Location:</span> {geoData.loc}
              </p>
              <p>
                <span className="font-bold">Postal:</span> {geoData.postal}
              </p>
              <p>
                <span className="font-bold">Timezone:</span> {geoData.timezone}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white w-fit h-fit p-3 rounded-lg flex flex-col gap-4">
          <form
            className="w-full h-fit flex items-center gap-3"
            onSubmit={searchIp}
          >
            <input
              type="text"
              className="w-[350px] border px-3 py-1 rounded-md focus:outline-none text-black placeholder:text-gray-400"
              placeholder="Type your IP Adress"
              onChange={(e) => setInputIP(e.target.value)}
            />

            <button
              type="submit"
              className="px-2 py-1 bg-blue-400 rounded-md cursor-pointer"
            >
              Show
            </button>
          </form>
          <div className="min-h-[300px]">
            {loadingSearch && <p>Loading...</p>}
            {invalidIp && <p className="text-red-500">Invalid IP</p>}
            {failedFetchingGep && (
              <p className="text-red-500">Failed fetching IP</p>
            )}

            {searchedGeoData && !failedFetchingGep && (
              <div>
                <h2>
                  <span className="font-bold">IP:</span> {searchedGeoData.ip}
                </h2>
                <p>
                  <span className="font-bold">City:</span>{" "}
                  {searchedGeoData.city}
                </p>
                <p>
                  <span className="font-bold">Region:</span>{" "}
                  {searchedGeoData.region}
                </p>
                <p>
                  <span className="font-bold">Country:</span>{" "}
                  {searchedGeoData.country}
                </p>
                <p>
                  <span className="font-bold">Location:</span>{" "}
                  {searchedGeoData.loc}
                </p>
                <p>
                  <span className="font-bold">Postal:</span>{" "}
                  {searchedGeoData.postal}
                </p>
                <p>
                  <span className="font-bold">Timezone:</span>{" "}
                  {searchedGeoData.timezone}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white w-fit h-fit p-3 rounded-lg flex flex-col gap-4">
          <h4 className="font-bold text-base text-center">Search History</h4>
          <div className="min-h-[300px] max-h-[400px] flex flex-col gap-3 overflow-y-auto">
            {history.map((current, id) => {
              return (
                <div key={id} className="border p-2 rounded-lg">
                  <h2>
                    <span className="font-bold">IP:</span> {current.ip}
                  </h2>
                  <p>
                    <span className="font-bold">City:</span> {current.city}
                  </p>
                  <p>
                    <span className="font-bold">Region:</span> {current.region}
                  </p>
                  <p>
                    <span className="font-bold">Country:</span>{" "}
                    {current.country}
                  </p>
                  <p>
                    <span className="font-bold">Location:</span> {current.loc}
                  </p>
                  <p>
                    <span className="font-bold">Postal:</span> {current.postal}
                  </p>
                  <p>
                    <span className="font-bold">Timezone:</span>{" "}
                    {current.timezone}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
