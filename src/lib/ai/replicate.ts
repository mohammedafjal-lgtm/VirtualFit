import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing environment variable: "REPLICATE_API_TOKEN"');
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/** Timeout wrapper to avoid hung requests */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label = "AI call"
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}