import Link from 'next/link';
import {Atom} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background mt-2 border-t py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link
              href="/"
              className="logo cursor-pointer flex items-center flex-row gap-2"
            >
              <Atom strokeWidth={1.5} className="w-8 h-8"/>
              <p className="text-xl font-semibold">Ăn chơi nét</p>
            </Link>
            <div className="flex mt-4 md:mt-0">
              <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                © 2024. All Rights Reserved.
              </span>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-4"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
