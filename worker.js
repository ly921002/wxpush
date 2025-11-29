export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 只处理 /send
    if (url.pathname === "/send" && request.method === "POST") {
      const data = await request.json();

      const key = data.key;
      if (!key) {
        return new Response("缺少 key 参数", { status: 400 });
      }

      const token = await getAccessToken(env);
      if (!token) {
        return new Response("获取 access_token 失败", { status: 500 });
      }

      const now = new Date(Date.now() + 8 * 3600 * 1000)  // 北京时间
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

      const body = {
        touser: env.OPENID,
        template_id: env.TEMPLATE_ID,
        url: "http://weixin.qq.com/download",
        data: {
          time: { value: now },
          text: { value: key }
        }
      };

      const pushUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;
      const res = await fetch(pushUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("WXPush Worker 在线运行中");
  },
};

// ========== 获取 token（自动缓存 110 分钟） ==========

async function getAccessToken(env) {
  const cache = caches.default;
  const cacheKey = new Request("https://wx_token_cache/");

  // 先查缓存
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached.text();
  }

  // 请求微信接口
  const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${env.APP_ID}&secret=${env.APP_SECRET}`;
  const res = await fetch(tokenUrl);
  const data = await res.json();

  if (!data.access_token) return null;

  // 7200 秒 = 官方有效期，存 6600 秒 安全一点
  await cache.put(cacheKey, new Response(data.access_token), {
    expirationTtl: 6600
  });

  return data.access_token;
}
