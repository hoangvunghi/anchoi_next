import {mainApi} from "@/api/main-api";
import {BlogType} from "@/types/main";
import {format} from "date-fns";
import {Metadata} from "next";

// Generate metadata for the page based on the blog details
export async function generateMetadata({params}: { params: { blogSlug: string } }): Promise<Metadata> {
  try {
    const blog = await mainApi.getDetailBlog({slug: params.blogSlug, server: true}) as unknown as BlogType;
    return {
      title: blog?.title || "Blog Detail",
    };
  } catch (err) {
    console.error("Error fetching blog for metadata:", err);
    return {
      title: "Blog Detail",
    };
  }
}

export async function generateStaticParams() {
  try {
    const blogs = await mainApi.getBlogs({server: true}) as unknown as BlogType[];
    return blogs.map((blog) => ({blogSlug: String(blog.id)}));
  } catch (err) {
    console.error("Error fetching blog slugs:", err);
    return [];
  }
}

export default async function BlogDetail({params}: { params: { blogSlug: string } }) {
  const {blogSlug} = params;
  let data: BlogType | null = null;
  try {
    data = await mainApi.getDetailBlog({slug: blogSlug, server: true}) as unknown as BlogType;
  } catch (err) {
    console.error("Error fetching blog details:", err);
  }
  console.log(data)
  if (!data) {
    return <div className="container mx-auto">Blog not found</div>;
  }

  return (
    <div className="my-2 container mx-auto">
      <div className="flex py-4 items-center flex-col pb-2">
        <p className="text-2xl font-semibold">{data.title}</p>
        <p className="text-sm text-muted-foreground">
          Tạo lúc: {format(new Date(data.created_at), "dd/MM/yyyy HH:mm")}
        </p>
      </div>
      <div
        className="flex mb-4 flex-col items-center"
        dangerouslySetInnerHTML={{__html: data.body}}
      ></div>
    </div>
  );
}
