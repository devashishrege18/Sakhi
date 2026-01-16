import './globals.css';

export const metadata = {
  title: 'Sakhi - Women\'s Health Companion',
  description: 'Your caring health companion for women\'s wellness',
  icons: {
    icon: '/sakhi-logo.png',
    apple: '/sakhi-logo.png',
    shortcut: '/sakhi-logo.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
