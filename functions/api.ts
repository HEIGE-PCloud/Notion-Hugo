interface Env {
  KV: KVNamespace;
  NOTION_TOKEN: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const token = await context.env.NOTION_TOKEN;
  return new Response(token.substring(0, 5));
};
