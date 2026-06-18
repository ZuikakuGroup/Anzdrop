export const runtime = "edge";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = getCloudflareContext();

    const result = await env.DB
      .prepare("SELECT COUNT(*) as count FROM shares")
      .first();

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}