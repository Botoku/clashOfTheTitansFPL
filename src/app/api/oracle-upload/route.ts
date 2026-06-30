// src/app/api/oracle-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as common from "oci-common";
import * as os from "oci-objectstorage";
 
// Force the Node.js runtime (not Edge) — the OCI SDK relies on Node APIs
// (crypto, Buffer, etc.) that aren't available in Vercel's Edge runtime.
export const runtime = "nodejs";
 
function loadPrivateKey(): string {
  const b64 = process.env.OCI_PRIVATE_KEY;
  if (!b64) {
    throw new Error("OCI_PRIVATE_KEY_B64 is not set");
  }
  return Buffer.from(b64, "base64").toString("utf-8");
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Load the private key ──
    const privateKey = loadPrivateKey();

    // ── 2. Build provider and client inside the handler ──
    const provider = new common.SimpleAuthenticationDetailsProvider(
      process.env.OCI_TENANCY_OCID!,
      process.env.OCI_USER_OCID!,
      process.env.OCI_FINGERPRINT!,
      privateKey,
      null,
      common.Region.fromRegionId(process.env.OCI_REGION!)
    );

    const client = new os.ObjectStorageClient({ authenticationDetailsProvider: provider });

    // ── 3. Parse the uploaded file ──
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const namespace = process.env.OCI_NAMESPACE!;
    const bucketName = process.env.OCI_BUCKET_NAME!;
    const objectName = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── 4. Upload to OCI ──
    await client.putObject({
      namespaceName: namespace,
      bucketName,
      objectName,
      putObjectBody: buffer,
      contentLength: buffer.length,
      contentType: file.type || "application/octet-stream",
    });

    const objectUrl = `https://objectstorage.${process.env.OCI_REGION}.oraclecloud.com/n/${namespace}/b/${bucketName}/o/${encodeURIComponent(objectName)}`;

    return NextResponse.json({ success: true, objectName, url: objectUrl });

  } catch (error: unknown) {
    console.error("OCI upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}