// app/blog/page.tsx

import {mainApi} from "@/api/main-api";
import {Card} from "@/components/ui/card";
import {BlogType} from "@/types/main";
import {format} from "date-fns";
import {Metadata} from "next";
import Link from "next/link";
import {API_URL, SERVER_URL} from "@/config";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Blogs",
};

async function fetchBlogs(): Promise<BlogType[]> {
  try {
    const res = await mainApi.getBlogs({server: true});
    return res as unknown as BlogType[];
  } catch (err) {
    console.log(err);
    return [];
  }
}



export default async function Blog() {
  const blogs = await fetchBlogs();

  return (
    <div className="my-2">
      <p className="text-2xl text-center font-semibold py-4">Blogs</p>
      {blogs.length > 0 ? (
        <div className="container grid lg:grid-cols-4 gap-8 md:grid-cols-3 sm:grid-cols-2">
          {blogs.map((item) => (
            <Link key={item.id} href={`/blog/${item.id}`}>
              <Card className="overflow-hidden group cursor-pointer">
                <div className="w-full h-64 relative">
                  <Image
                    src={(SERVER_URL || API_URL) + `storage/${item.banner_image}`}
                    alt="Blog Image"
                    layout="fill"
                    className='transition-all group-hover:scale-[1.05] duration-500'
                    objectFit="cover"
                  />
                </div>
                <div className="px-4 py-2 space-y-1">
                  <p className="font-semibold text-xl">{item.title}</p>
                  <p className="text-muted-foreground text-sm">
                    Danh mục: {item?.category_slug || "Chưa có"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Tạo lúc: {format(new Date(item.created_at), "dd/MM/yyyy HH:mm")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Sửa lúc: {format(new Date(item.updated_at), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full py-10">
          No blogs found
        </div>
      )}
    </div>
  );
}
