// app/home/page.tsx

import {LoaderCircle} from 'lucide-react';

import {AnChoi} from '@/types/main';
import {mainApi} from '@/api/main-api';
import CardLocation from "@/components/shared/card-location";
import {SearchBarComp} from "@/components/shared/search-bar";
import Link from "next/link";

const fetchData = async () => {
  try {
    const [diemHot, diemAn, diemChoi] = await Promise.all([
      mainApi.getLocationHot({server: true}),
      mainApi.getEatHot({server: true}),
      mainApi.getPlayHot({server: true}),
    ]);

    return {
      locationHot: diemHot as unknown as AnChoi[],
      eatHot: diemAn as unknown as AnChoi[],
      playHot: diemChoi as unknown as AnChoi[],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      locationHot: [],
      eatHot: [],
      playHot: [],
    };
  }
};

const Home = async () => {
  const {locationHot, eatHot, playHot} = await fetchData();
  if (!locationHot.length && !eatHot.length && !playHot.length) {
    return (
      <div className="flex-1 flex h-full items-center justify-center w-full">
        <LoaderCircle className="w-5 h-5 animate-spin"/>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-4 space-y-2">
        <p className="text-2xl font-semibold">Tìm điểm ăn chơi</p>
        <SearchBarComp/>
      </div>
      <div className="py-4 space-y-3">
        <div className="flex flex-row items-end gap-4">
          <p className="text-2xl font-semibold">Địa điểm hot</p>
          <Link
            href="/list-all/all"
            className="hover:underline text-sm text-muted-foreground cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>
        <CardLocation items={locationHot}/>
      </div>
      <div className="py-4 space-y-3">
        <div className="flex flex-row items-end gap-4">
          <p className="text-2xl font-semibold">Điểm ăn nét</p>
          <Link
            href="/list-all/eat"
            className="hover:underline text-sm text-muted-foreground cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>
        <CardLocation items={eatHot}/>
      </div>
      <div className="py-4 space-y-3">
        <div className="flex flex-row items-end gap-4">
          <p className="text-2xl font-semibold">Điểm chơi nét</p>
          <Link
            href="/list-all/play"
            className="hover:underline text-sm text-muted-foreground cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>
        <CardLocation items={playHot}/>
      </div>
    </div>
  );
};

export default Home;
