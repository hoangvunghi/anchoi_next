// context/AppContext.tsx
"use client"

import {searchApi} from "@/api/search-api";
import {District, EntertainmentType, Provice, Ward} from "@/types/main";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface AppContextProps {
  entertainmentTypes: EntertainmentType[];
  provinces: Provice[];
  districts: District[];
  wards: Ward[];
  location: { lat: number; lon: number };
  setDistricts: (districts: District[]) => void;
  setWards: (wards: Ward[]) => void;
  getWardName: (wardId: number) => Ward | undefined;
  fetchLocation: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [entertainmentTypes, setEntertainmentTypes] = useState<EntertainmentType[]>([]);
  const [provinces, setProvinces] = useState<Provice[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number }>({lat: 0, lon: 0});

  const getWardName = (wardId: number) => {
    if (wards.length > 0) {
      return wards.find((item) => item.id === wardId);
    }
    return undefined;
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Error fetching location", err.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, provincesData] = await Promise.all([
          searchApi.getTypes({server: false}),
          searchApi.getProvinces(),
        ]);

        setEntertainmentTypes(typesData as unknown as EntertainmentType[]);
        setProvinces(provincesData as unknown as Provice[]);
        fetchLocation(); // Fetch location on component mount
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        entertainmentTypes,
        provinces,
        districts,
        setDistricts,
        wards,
        setWards,
        getWardName,
        location,
        fetchLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
