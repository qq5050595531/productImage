import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NanoBanana - 产品图生成器',
  description: '使用 AI 技术生成创意产品图',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
