import {mainApi} from '@/api/main-api';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {AnChoi} from '@/types/main';
import {LoaderCircle} from 'lucide-react';
import CardLocation from "@/components/shared/card-location";
import {notFound} from 'next/navigation';
import React from "react";

interface Props {
  data: AnChoi[];
  locType: string;
}

const ListLocation = ({data, locType}: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex-1 flex h-full items-center justify-center w-full">
        <LoaderCircle className="w-5 h-5 animate-spin"/>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-4 space-y-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>{`Điểm ${
                locType === 'all'
                  ? 'hot'
                  : locType === 'eat'
                    ? 'ăn nét'
                    : 'chơi nét'
              }`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-end gap-4">
          <p className="text-2xl font-semibold">
            {`Điểm ${
              locType === 'all'
                ? 'hot'
                : locType === 'eat'
                  ? 'ăn nét'
                  : 'chơi nét'
            }`}
          </p>
        </div>
        <CardLocation items={data}/>
      </div>
    </div>
  );
};

export async function generateStaticParams() {
  const locTypes = ['eat', 'play', 'all'];

  return locTypes.map((locType) => ({
    locType,
  }));
}

interface FetchDataSuccess {
  data: AnChoi[];
  locType: string;
}

interface FetchDataError {
  notFound: true;
}

type FetchDataResult = FetchDataSuccess | FetchDataError;

async function fetchData(locType: string): Promise<FetchDataResult> {
  const apiMapping: Record<string, () => Promise<{ data: AnChoi[] }>> = {
    eat: () => mainApi.getAllEatHot({server: true}),
    play: () => mainApi.getAllPlayHot({server: true}),
    all: () => mainApi.getAllLocationHot({server: true}),
  };

  if (!apiMapping[locType]) {
    return {notFound: true};
  }

  try {
    const response = await apiMapping[locType]();
    return {
      data: response.data,
      locType,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {notFound: true};
  }
}

export default async function ListLocationPage({params}: { params: { locType: string } }) {
  const {locType} = params;
  const result = await fetchData(locType);

  if ("notFound" in result && result?.notFound) {
    return notFound();
  }

  return <ListLocation data={"data" in result ? result.data : []} locType={"locType" in result ? result.locType : ''}/>;
}
