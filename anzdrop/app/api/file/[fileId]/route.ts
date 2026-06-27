import { getCloudflareContext } from "@opennextjs/cloudflare";

type FileRecord = {
  id: string;
  share_id: string;
  storage_key: string;
  encrypted_file_name: string;
};

type RouteContext = {
  params: Promise<{
    fileId: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { env } = getCloudflareContext();

    const { fileId } = await context.params;

    const file = await env.DB.prepare(
      `
      SELECT
        id,
        share_id,
        storage_key,
        encrypted_file_name
      FROM files
      WHERE id = ?
      `
    )
      .bind(fileId)
      .first<FileRecord>();

    if (!file) {
      return Response.json(
        {
          success: false,
          error: "File not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      file,
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