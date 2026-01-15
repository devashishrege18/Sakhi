import './globals.css';

export const metadata = {
  title: 'Sakhi - Women\'s Health Companion',
  description: 'Your caring health companion for women\'s wellness',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
