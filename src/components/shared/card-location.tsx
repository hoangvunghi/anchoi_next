import {Card} from "@/components/ui/card";
import {AnChoi} from "@/types/main";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {API_URL, SERVER_URL} from "@/config";

interface CardLocationProps {
  items: AnChoi[];
}

const CardLocation = ({items}: CardLocationProps) => {
  return (
    <div className="grid lg:grid-cols-4 gap-8 md:grid-cols-3 max-[730px]:grid-cols-2 max-[450px]:grid-cols-1">
      {items?.length > 0 ? (
        items.map((item) => (
          <Link
            key={item.id}
            href={`/detail/${item.entertainment_type_slug}-${item.ward_slug}/${item.slug}`}
            passHref
            className="overflow-hidden group cursor-pointer"
          >
            <Card>
              <div className="w-full h-64 relative">
                <Image
                  src={(SERVER_URL || API_URL) + `storage/${item.banner_image}`}
                  alt="Product Image"
                  fill
                  style={{objectFit: 'cover'}}
                  className='transition-all group-hover:scale-[1.05] duration-500'
                />
              </div>

              <div className="px-4 py-2 space-y-1">
                <p className="font-semibold line-clamp-1 text-ellipsis text-xl">
                  {item.name}
                </p>
                <p className="text-muted-foreground line-clamp-1 text-ellipsis text-sm">
                  Địa điểm: {item?.full_address || "Chưa có"}
                </p>
                <p className="text-muted-foreground line-clamp-1 text-ellipsis text-sm">
                  Số điện thoại: {item?.phone_number || "Chưa có"}
                </p>
                <p className="text-muted-foreground line-clamp-1 text-ellipsis text-sm">
                  Khu vực: {item?.ward_name || "Chưa có"}
                </p>
              </div>
            </Card>
          </Link>
        ))
      ) : (
        <div className="w-full col-span-4 flex items-center justify-center py-5">
          No data found
        </div>
      )}
    </div>
  );
};

export default CardLocation;
