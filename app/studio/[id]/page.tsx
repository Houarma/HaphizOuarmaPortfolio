"use client";

import { use } from "react";
import Gate from "@/components/studio/Gate";
import Editor from "@/components/studio/Editor";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <Gate>{(user) => <Editor id={id} user={user} />}</Gate>;
}
