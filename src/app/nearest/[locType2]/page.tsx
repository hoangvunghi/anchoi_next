'use client';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {AnChoi} from '@/types/main';
import {LoaderCircle} from 'lucide-react';
import CardLocation from '@/components/shared/card-location';
import {searchApi} from '@/api/search-api';
import {AppProvider, useAppContext} from "@/components/providers/app-context";

export default function ListLocation2Page() {
  const {locType2} = useParams();

  return (
    <AppProvider>
      <ListLocation2 locType2={locType2 as string}/>
    </AppProvider>
  );
}
function ListLocation2({locType2}: { locType2: string }) {
  const [data, setData] = useState<AnChoi[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Kết quả');
  const {location} = useAppContext();

  useEffect(() => {
    if (!locType2) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = (locType2 === 'all'
          ? await searchApi.findNear(location)
          : await searchApi.findNearWithType(location.lat, location.lon, locType2 as string)) as unknown as {
          entertainmentSpots: AnChoi[];
          titlePage: string;
          title: string;
        };

        setData(response.entertainmentSpots);
        document.title = response.titlePage;
        setTitle(response.title);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locType2, location, router]);

  if (loading) {
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
              <BreadcrumbPage>{document.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-row items-end gap-4">
          <p className="text-2xl font-semibold">{title}</p>
        </div>
        <CardLocation items={data}/>
      </div>
    </div>
  );
}
