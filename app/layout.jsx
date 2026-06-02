// app/layout.jsx
import './globals.css'
import NavBar from '../components/NavBar'

export const metadata = {
  title: 'D2 Weapon Tracker — Monument of Triumph Final Standing',
  description: 'Every Destiny 2 weapon with full patch history and final sandbox state after the June 9, 2026 Monument of Triumph update.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}