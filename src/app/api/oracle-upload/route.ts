// src/app/api/oracle-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import common from "oci-common";
import os from "oci-objectstorage";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // ── 1. Read the private key from disk inside the handler ──
    const keyPath = process.env.OCI_PRIVATE_KEY;
    if (!keyPath) {
      return NextResponse.json({ error: "OCI_PRIVATE_KEY_PATH is not set in .env.local" }, { status: 500 });
    }

    const resolved = path.resolve(process.cwd(), keyPath);
    if (!fs.existsSync(resolved)) {
      return NextResponse.json({ error: `Key file not found: ${resolved}` }, { status: 500 });
    }

    const privateKey = fs.readFileSync(resolved, "utf-8");

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