import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    return Response.json({
      success: true,
      message: "upload api ok",
      hasDB: !!env.DB,
      hasBucket: !!env.FILES_BUCKET,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}