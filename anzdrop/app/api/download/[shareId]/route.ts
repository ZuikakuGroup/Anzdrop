import { getCloudflareContext } from "@opennextjs/cloudflare";

type RouteContext = {
  params: Promise<{
    shareId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { env } = getCloudflareContext();

    const { shareId } = await context.params;

    const share = await env.DB.prepare(
      `
      SELECT id, created_at, expires_at
      FROM shares
      WHERE id = ?
    `
    )
      .bind(shareId)
      .first();

    if (!share) {
      return Response.json(
        {
          success: false,
          error: "Share not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      share,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}