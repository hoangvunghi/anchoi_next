import {notFound} from 'next/navigation';
import {mainApi} from '@/api/main-api';
import CardLocation from '@/components/shared/card-location';
import CommentBox from '@/components/shared/comment-box';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {AnChoi} from '@/types/main';
import {Star} from 'lucide-react';
import Link from 'next/link';
import {API_URL, SERVER_URL} from "@/config";
import Head from "next/head";
import Script from "next/script";

interface PageProps {
  params: { param: string; slugDetail: string };
}

async function fetchData(param: string, slugDetail: string) {
  try {
    const detailData = await mainApi.getDetailLoc({param, slug: slugDetail, server: true}) as unknown as {
      entertainmentSpot: AnChoi;
      titlePage: string;
    }
    const relateData = await mainApi.getRelate(
      {id: String(detailData.entertainmentSpot.id), server: true}
    ) as unknown as AnChoi[];

    return {
      detailData,
      relateData,
    };
  } catch (err) {
    return {detailData: null, relateData: []};
  }
}

export default async function DetailLocation({params}: PageProps) {
  const {param, slugDetail} = params;
  const {detailData, relateData} = await fetchData(param, slugDetail);

  if (!detailData) {
    notFound();
  }

  const {entertainmentSpot: data, titlePage} = detailData;

  return (
    <div className="container relative flex flex-row gap-4">

        <Script
          id="JSON_LTD"
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(detailData.entertainmentSpot.header)}}
        />
      <div className="flex-1">
        <div className="py-4 space-y-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator/>
              <BreadcrumbItem>
                <BreadcrumbPage>{titlePage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-row items-end gap-4">
            <p className="text-2xl font-semibold">{titlePage}</p>
          </div>
          <div className="py-4 font-semibold border-y flex flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span>Số điện thoại</span>
              <span>{data.phone_number}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Địa điểm</span>
              <div className="inline-block">
                <Link
                  className="hover:underline"
                  href={`/${data.entertainment_type_slug}-${data.provin_slug}-${data.district_slug}-${data.ward_slug}`}
                >
                  {data.ward_name}
                </Link>
                ,{" "}
                <Link
                  className="hover:underline"
                  href={`/${data.entertainment_type_slug}-${data.provin_slug}-${data.district_slug}`}
                >
                  {data.district_name}
                </Link>
                ,{" "}
                <Link
                  className="hover:underline"
                  href={`/${data.entertainment_type_slug}-${data.provin_slug}`}
                >
                  {data.province_name}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span>Loại hình</span>
              <Link
                className="hover:underline"
                href={`/${data.entertainment_type_slug}`}
              >
                {data.entertainment_type_name}
              </Link>
            </div>
          </div>
        </div>
        <img
          src={`${(SERVER_URL || API_URL)}/storage/${data.banner_image}`}
          alt="Product Image"
          className="w-full group-hover:scale-[1.05] transition-all duration-500  h-64 object-cover"
        />
        <div className="py-3 border-t mt-4">
          <p className="text-lg font-semibold mb-2">Thông tin chi tiết</p>
          <div dangerouslySetInnerHTML={{__html: data.description}}></div>
          <p className="font-semibold">Địa chỉ: {data.full_address}</p>
        </div>
        <div className="border-t py-4">
          <p className="text-lg font-semibold mb-2">Thông tin liên hệ</p>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col gap-2">
              <span>Họ tên</span>
              <span className="font-semibold">{data.name_of_owner}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Số điện thoại</span>
              <span className="font-semibold">{data.phone_number}</span>
            </div>
          </div>
        </div>
        <div className="py-3 border-t mt-4">
          <p className="text-lg font-semibold mb-2">Địa điểm liên quan</p>
          {relateData.length ? (
            <CardLocation items={relateData}/>
          ) : (
            "Không có cửa hàng liên quan"
          )}
        </div>
        <div className="py-3 border-t mt-4">
          <p className="text-lg font-semibold mb-2">Đánh giá & bình luận</p>
          <div className="flex flex-row items-center gap-2">
            Số sao trung bình:{" "}
            {data.average_rating ? (
              <div className="flex flex-row font-semibold items-center gap-1">
                {data.average_rating}{" "}
                <Star className="w-4 h-4 stroke-yellow-400 fill-yellow-400"/>{" "}
              </div>
            ) : (
              "Chưa có đánh giá"
            )}
          </div>
          <CommentBox idSpot={data.id}/>
        </div>
      </div>
      <div className="sticky h-fit hidden md:block space-y-4 max-w-[300px] mt-10 top-[20px]">
        <div
          className="flex flex-col p-6 items-center gap-4 bg-[#1f1f29] dark:bg-muted text-white dark:text-muted-foreground rounded-lg">
          <p className="font-semibold text-2xl text-center">{data.name}</p>
          <div className="py-2 bg-[red] text-center px-10 rounded-md text-lg font-semibold text-white">
            {data.phone_number}
          </div>
          <p className="text-center">
            Liên hệ ngay để được đặt chỗ trước và tư vấn miễn phí
          </p>
        </div>
        <div
          className="flex flex-col p-6 gap-4 bg-[#1f1f29] dark:bg-muted text-white dark:text-muted-foreground rounded-lg">
          <p>
            <span className="font-semibold">Giờ hoạt động: </span>
            {data.opening_hours}
          </p>
          <p>
            <span className="font-semibold">Thông tin thêm: </span>
            {data.additional_info}
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({params}: PageProps) {
  const {param, slugDetail} = params;
  const {detailData} = await fetchData(param, slugDetail);

  if (!detailData) {
    return {title: "Not Found"};
  }

  const {titlePage} = detailData;

  return {
    title: titlePage,
    description: detailData.entertainmentSpot.detailHeader || "Default description",
  };
}
