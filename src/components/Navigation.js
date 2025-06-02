'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-400">
          Split Bill
        </Link>
        
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded ${
              pathname === '/' ? 'bg-blue-600' : 'hover:bg-slate-700'
            }`}
          >
            Events
          </Link>
        </div>
      </div>
    </nav>
  );
}