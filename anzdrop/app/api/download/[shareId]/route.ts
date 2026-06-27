import { getCloudflareContext } from "@opennextjs/cloudflare";

type Share = {
  id: string;
  created_at: string;
  expires_at: string;
};

type FileRecord = {
  id: string;
  share_id: string;
  storage_key: string;
  encrypted_file_name: string;
};

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
      .first<Share>();

    if (!share) {
      return Response.json(
        {
          success: false,
          error: "Share not found",
        },
        { status: 404 }
      );
    }

    const expiresAt = new Date(share.expires_at);

    if (expiresAt <= new Date()) {
      return Response.json(
        {
          success: false,
          error: "Share has expired",
        },
        { status: 410 }
      );
    }

    const { results: files } = await env.DB.prepare(
      `
        SELECT
          id,
          share_id,
          storage_key,
          encrypted_file_name
        FROM files
        WHERE share_id = ?
      `
    )
      .bind(shareId)
      .all<FileRecord>();

    return Response.json({
      success: true,
      share,
      files,
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