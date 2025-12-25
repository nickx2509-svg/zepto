import { NextResponse } from "next/server"
import { ApiError } from "./ApiError"

type AsyncFn<T = unknown> = (...args: unknown[]) => Promise<T>

export const asyncHandler =
  <T>(fn: AsyncFn<T>) =>
  async (...args: unknown[]) => {
    try {
      return await fn(...args)
    } catch (error: unknown) {
      const err =
        error instanceof ApiError
          ? error
          : new ApiError(
              500,
              error instanceof Error
                ? error.message
                : "Internal Server Error"
            )

      return NextResponse.json(
        {
          success: false,
          message: err.message,
        },
        { status: err.statusCode }
      )
    }
  }
