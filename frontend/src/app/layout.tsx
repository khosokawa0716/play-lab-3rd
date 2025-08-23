import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'プレイラボ！ - 楽しく学べるゲームセンター',
  description: '子どもが楽しく遊べて、自然と学びにもつながるWebゲームセンター',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-game bg-game-bg min-h-screen">
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}