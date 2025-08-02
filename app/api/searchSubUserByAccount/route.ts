import { type NextRequest, NextResponse } from "next/server"
import { apiRequestWithAuth } from "@/lib/api-config"

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization")
    if (!authorization) {
      return NextResponse.json({ code: 401, msg: "未授权", data: null }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const size = searchParams.get("size") || "10"
    const keyword = searchParams.get("keyword")
    
    if (!keyword || !keyword.trim()) {
      return NextResponse.json({ code: 400, msg: "搜索关键词不能为空", data: null }, { status: 400 })
    }

    const token = authorization.replace("Bearer ", "")
    
    // 构建查询参数
    const params = new URLSearchParams({
      page,
      size,
      keyword: keyword.trim()
    })
    
    const result = await apiRequestWithAuth(`/searchSubUserByAccount?${params.toString()}`, token, {
      method: "GET",
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ code: 500, msg: "服务器错误", data: null }, { status: 500 })
  }
}