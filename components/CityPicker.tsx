"use client";

import { RiEarthLine } from "@remixicon/react";
import { Country, City } from "country-state-city";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";

type option = {
  value: {
    latitude: string;
    longitude: string;
    isoCode: string;
  };
  label: string;
} | null;

type cityOption = {
  value: {
    latitude: string | "" | undefined;
    longitude: string | "" | undefined;
    countryCode: string;
    name: string;
    stateCode: string;
  };
  label: string;
} | null;

const options = Country.getAllCountries().map((country) => ({
  value: {
    latitude: country.latitude,
    longitude: country.longitude,
    isoCode: country.isoCode,
  },
  label: country.name,
}));

function CityPicker() {
  const [selectedCountry, setSelectedCountry] = useState<option>(null);
  const [selectedCity, setSelectedCity] = useState<cityOption>(null);
  const router = useRouter();
  const pathname = usePathname();

  function handleSelectedCountry(option: option) {
    setSelectedCountry(option);
    setSelectedCity(null);
  }
  function handleSelectedCity(city: cityOption) {
    setSelectedCity(city);
    router.push(
      `/location/${city?.value.name}/${city?.value.latitude}/${city?.value.longitude}`
    );
  }
  const autofocus = pathname === "/";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-white/80">
          <RiEarthLine className="text-white h-5 w-5" />
          <label htmlFor="country">Country</label>
        </div>
        <Select
          className="text-gray-800"
          id="country"
          value={selectedCountry}
          onChange={handleSelectedCountry}
          placeholder="Select a country..."
          options={options}
          autoFocus={autofocus}
        />
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-white/80">
            <RiEarthLine className="text-white h-5 w-5" />
            <label htmlFor="city">City</label>
          </div>
          <Select
            className="text-gray-800"
            id="city"
            value={selectedCity}
            onChange={handleSelectedCity}
            placeholder="Select a city..."
            autoFocus={true}
            options={City.getCitiesOfCountry(
              selectedCountry!.value.isoCode
            )?.map((city) => ({
              value: {
                latitude: city.latitude || "",
                longitude: city.longitude || "",
                countryCode: city.countryCode,
                name: city.name,
                stateCode: city.stateCode,
              },
              label: city.name,
            }))}
          />
        </div>
      )}
    </div>
  );
}

export default CityPicker;
