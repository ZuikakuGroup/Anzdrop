import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    const formData = await request.formData();

    const files = formData.getAll("files");

    return Response.json({
      success: true,
      count: files.length,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}