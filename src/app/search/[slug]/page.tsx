import {notFound} from 'next/navigation';
import {searchApi} from '@/api/search-api';
import CardLocation from '@/components/shared/card-location';
import {SearchBarComp} from '@/components/shared/search-bar';
import {AnChoi} from '@/types/main';
import Head from "next/head";


export default async function SearchData({params}: { params: { slug: string } }) {
  const {slug} = params;
  let data: AnChoi[] = [];
  let title = "Kết quả";
  let pageTitle = "Default Page Title";

  try {
    const res = await searchApi.search({slug, server: true}) as unknown as {
      entertainmentSpots: AnChoi[];
      pageTitle: string;
      title: string;
    };
    data = res.entertainmentSpots;
    title = res.title;
    pageTitle = res.pageTitle;
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <div className="container">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className="py-4 space-y-2">
        <p className="text-2xl font-semibold">Tìm kiếm</p>
        <SearchBarComp/>
      </div>
      <div className="py-4 space-y-2">
        <p className="text-2xl font-semibold">{title}</p>
        <CardLocation items={data}/>
      </div>
    </div>
  );
}
