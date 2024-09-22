import {Atom, Menu} from "lucide-react";
import {Button} from "../ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "../ui/sheet";
import {ModeToggle} from "./mode-toggle";
import Link from "next/link";
import {searchApi} from "@/api/search-api";
import {EntertainmentType} from "@/types/main";

async function fetchEntertainmentTypes() {
  try {
    const typesData = await searchApi.getTypes({server: true});
    return typesData as unknown as EntertainmentType[];
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
}

export default async function Header() {
  const entertainmentTypes = await fetchEntertainmentTypes();
  return (
    <header className="w-full bg-background sticky top-0 left-0 border-b">
      <div className="flex flex-row container py-4 justify-between items-center">
        <Link
          href="/"
          className="logo cursor-pointer flex items-center flex-row gap-2"
        >
          <Atom strokeWidth={1.5} className="w-8 h-8"/>
          <p className="text-xl font-semibold">Ăn chơi nét</p>
        </Link>
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden flex" variant="outline" size="icon">
                <Menu className="w-5 h-5"/>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-4 gap-2">
                <Link href="/" className="hover:underline">
                  Trang chủ
                </Link>
                {entertainmentTypes.map(item => (
                  <Link key={item.id} href={`/nearest/${item.slug}`} className="hover:underline">
                    Điểm {item.name} gần
                  </Link>
                ))}
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
                <Link href="/contact" className="hover:underline">
                  Liên hệ
                </Link>
                <ModeToggle/>
              </div>
            </SheetContent>
          </Sheet>
          <nav className="md:flex hidden flex-row items-center gap-8">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            {entertainmentTypes.map(item => (
              <Link key={item.id} href={`/nearest/${item.slug}`} className="hover:underline">
                Điểm {item.name} gần
              </Link>
            ))}
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <Link href="/contact" className="hover:underline">
              Liên hệ
            </Link>
            <ModeToggle/>
          </nav>
        </div>
      </div>
    </header>
  );
}
