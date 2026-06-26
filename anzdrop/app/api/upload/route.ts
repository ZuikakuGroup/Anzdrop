import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();

    const formData = await request.formData();
    const files = formData.getAll("files");

    const uploadFiles = files.filter(
      (item): item is File => item instanceof File
    );

    if (uploadFiles.length === 0) {
      return Response.json({
        success: false,
        error: "No files uploaded",
      }, { status: 400 });
    }

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

    for (const item of uploadFiles) {
      const fileId = crypto.randomUUID();
      const storageKey = crypto.randomUUID();

      // R2へ保存
      await env.FILES_BUCKET.put(
        storageKey,
        await item.arrayBuffer()
      );

      // D1へ保存
      await env.DB.prepare(
        `
      INSERT INTO files (
        id,
        share_id,
        storage_key,
        encrypted_file_name
      )
      VALUES (?, ?, ?, ?)
    `
      )
        .bind(
          fileId,
          shareId,
          storageKey,
          item.name // TODO: クライアント側暗号化後は暗号化済みファイル名に置き換える
        )
        .run();
    }

    return Response.json({
      success: true,
      shareId,
      fileCount: uploadFiles.length,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}