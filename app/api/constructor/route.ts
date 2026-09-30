import { NextResponse } from "next/server";

import { generateRecommendations } from "@/lib/constructor/recommendations";
import { constructorSchema } from "@/lib/validation/constructor";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const validation =
      constructorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Некорректные данные",
          details:
            validation.error.flatten()
        },
        {
          status: 400
        }
      );
    }

    const recommendations =
      generateRecommendations(
        validation.data
      );

    return NextResponse.json({
      success: true,
      recommendations,
      createdAt:
        new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка обработки запроса"
      },
      {
        status: 500
      }
    );
  }
}