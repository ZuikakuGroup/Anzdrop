import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    const formData = await request.formData();
    const files = formData.getAll("files");

    const shareId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    await env.DB.prepare(
      `
        INSERT INTO shares (
          id,
          created_at,
          expires_at
        )
        VALUES (?, ?, ?)
      `
    )
      .bind(
        shareId,
        createdAt,
        expiresAt
      )
      .run();

    return Response.json({
      success: true,
      shareId,
      count: files.length,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}