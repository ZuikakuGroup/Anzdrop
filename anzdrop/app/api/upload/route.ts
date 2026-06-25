import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({
        success: false,
        error: "file not found",
      });
    }

    const storageKey = crypto.randomUUID();

    await env.FILES_BUCKET.put(
      storageKey,
      await file.arrayBuffer()
    );

    return Response.json({
      success: true,
      storageKey,
      fileName: file.name,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}