import { getClient } from "@/apolo-client";
import CalloutCard from "@/components/CalloutCard";
import HumidityChart from "@/components/HumidityChart";
import InformationPanel from "@/components/InformationPanel";
import RainChart from "@/components/RainChart";
import StatCard from "@/components/StatCard";
import TempChart from "@/components/TempChart";
import fetchWeatherQueries from "@/graphql/queries/fetchWeatherQueries";
import { cleanData } from "@/lib/cleandData";
import { getBasePath } from "@/lib/getBasePath";

export const revalidate = 1440;

type WeatherPageProps = {
  params: {
    city: string;
    lat: string;
    long: string;
  };
};

async function WeatherPage({ params: { city, lat, long } }: WeatherPageProps) {
  const client = getClient();

  const { data } = await client.query({
    query: fetchWeatherQueries,
    variables: {
      current_weather: "true",
      longitude: long,
      latitude: lat,
      timezone: "EET",
    },
  });

  const results: Root = data.myQuery;

  const dataToSend = cleanData(results, city);

  async function fetchOpenAi() {
    let openAIData; // Define openAIData here
    try {
      const res = await fetch(`${getBasePath()}/api/getWeatherSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weatherData: dataToSend }),
      });
      if (!res.ok) {
        console.log("Response status:", res.status);
        console.log("Response status text:", res.statusText);
        throw new Error(
          "Failed to fetch GPT data, Response status:" +
            res.status +
            "Response status text" +
            res.statusText +
            res.json()
        );
      }
      const { data } = await res.json();
      openAIData = data; // Assign the value here
    } catch (error: Error | any) {
      console.error("Failed to fetch GPT data", error, error.message);
    }
    return openAIData;
  }

  const openAIData = await fetchOpenAi();
  // const { data: openAIData } = GPTdata;

  return (
    <div className="flex flex-col min-h-screen xl:flex-row">
      <InformationPanel city={city} lat={lat} long={long} results={results} />

      <div className="flex-1 p-3 lg:p-10">
        <div className="pb-5">
          <div className="pb-5 m-4">
            <h2 className="text-xl font-bold">Todays Overview</h2>
            <p className="text-sm text-gray-400">
              Last Updated at:{" "}
              {new Date(results.current_weather.time).toLocaleString()} (
              {results.timezone})
            </p>
          </div>

          <div className="m-4 mb-10">
            <CalloutCard message={openAIData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-4">
            <StatCard
              title="Maximum Temperature"
              metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°`}
              color="yellow"
            />

            <StatCard
              title="Minimum Temperature"
              metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°`}
              color="green"
            />

            <div>
              <StatCard
                title="UV Index"
                metric={results.daily.uv_index_max[0].toFixed(1)}
                color="rose"
              />
              {Number(results.daily.uv_index_max[0]) > 5 && (
                <CalloutCard
                  message="The UV is high today, be sure to wear SPF!"
                  warning
                />
              )}
            </div>

            <div className="flex space-x-3">
              <StatCard
                title="Wind Speed"
                color="cyan"
                metric={`${results.current_weather.windspeed.toFixed(1)} m/s`}
              />
              <StatCard
                title="Wind Direction"
                metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                color="violet"
              />
            </div>
          </div>
        </div>

        <hr className="mb-5" />
        <div className="space-y-3">
          <TempChart results={results} />
          <RainChart results={results} />
          <HumidityChart results={results} />
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
