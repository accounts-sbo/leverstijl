import { Lato, Poppins } from 'next/font/google'
import { Layout } from '@/components/dom/Layout'
import dynamic from 'next/dynamic'
import '@/global.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'mdlfonds',
  description: 'Voorheen Maag Lever Darm Stichting',
}


const Logo = dynamic(() => import('@/components/Logo'), { ssr: false })

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={`antialiased ${lato.variable} ${poppins.variable}`}>
      <head />
      <body>
        <Layout>
          <div className='absolute top-0 left-0 p-4 z-10'>
            <Logo />
          </div>
          {children}
        </Layout>
      </body>
    </html>
  )
}
