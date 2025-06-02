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
      </body>
    </html>
  )
}