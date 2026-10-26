import { submitPostExam } from "@/lib/submit-post-exam.mjs";

export async function POST(request) {
  return submitPostExam(request, {
    scriptUrl: process.env.NEXT_PUBLIC_EVENT_SCRIPT_URL,
  });
}
