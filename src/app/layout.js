import './globals.css'

export const metadata = {
  title: 'Split Bill App',
  description: 'Aplikasi pembagi tagihan yang mudah dan praktis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* <script
          src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.12/sweetalert2.min.js"
          strategy="beforeInteractive"
        /> */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.12/sweetalert2.min.css"
        />
      </head>
      <body className="bg-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
        <footer className='bg-slate-800 border-t border-slate-700 p-2'>
          <nav className="container mx-auto flex justify-center items-center">
            <div className="text-center">
              © {new Date().getFullYear()} Split Bill App | Build with 🌹 by • E L E N T
            </div>
          </nav>
        </footer>
      </body>
    </html>
  )
}