import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // ถ้าเข้า /admin แต่ไม่ใช่ ADMIN → redirect ไป /
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // authorized คือ มี token อยู่ (login แล้ว)
      authorized: ({ token }) => !!token,
    },
  }
)

// route ไหนบ้างที่ต้องผ่าน middleware
export const config = {
  matcher: ['/admin/:path*', '/orders/:path*'],
}