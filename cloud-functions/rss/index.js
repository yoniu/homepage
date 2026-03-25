const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_COUNT = 1000;
const DEFAULT_FEED_TITLE = 'Yoniu Moment';
const DEFAULT_FEED_DESCRIPTION = 'Latest public moments';
const DEFAULT_FEED_LANGUAGE = 'zh-CN';
const DEFAULT_CACHE_TTL = 600;

export async function onRequest(context) {
  const { request, env, waitUntil } = context;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        Allow: 'GET, HEAD',
      },
    });
  }

  const apiBaseUrl = env?.NEXT_PUBLIC_HOMEPAGE_API || env?.HOMEPAGE_API;
  if (!apiBaseUrl) {
    return createErrorResponse('Missing NEXT_PUBLIC_HOMEPAGE_API or HOMEPAGE_API.', 500);
  }

  const requestUrl = new URL(request.url);
  const siteUrl = resolveSiteUrl(env, requestUrl);
  const cacheKey = new Request(normalizeFeedUrl(siteUrl));
  const cache = getCache();

  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      return createResponseFromCached(cached, request.method);
    }
  }

  try {
    const moments = await fetchAllMoments(apiBaseUrl);
    const feed = buildRssXml({
      feedUrl: normalizeFeedUrl(siteUrl),
      homeUrl: siteUrl,
      feedTitle: env?.RSS_FEED_TITLE || DEFAULT_FEED_TITLE,
      feedDescription: env?.RSS_FEED_DESCRIPTION || DEFAULT_FEED_DESCRIPTION,
      feedLanguage: env?.RSS_FEED_LANGUAGE || DEFAULT_FEED_LANGUAGE,
      moments,
    });

    const response = createRssResponse(feed, request.method, env);

    if (cache) {
      waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  } catch (error) {
    return createErrorResponse(error instanceof Error ? error.message : 'Failed to generate RSS.', 500);
  }
}

function getCache() {
  if (typeof caches === 'undefined' || !caches.default) {
    return null;
  }

  return caches.default;
}

function createResponseFromCached(cached, method) {
  if (method === 'HEAD') {
    return new Response(null, {
      status: cached.status,
      statusText: cached.statusText,
      headers: cached.headers,
    });
  }

  return cached;
}

function createRssResponse(xml, method, env) {
  const ttl = resolveCacheTtl(env);
  const headers = new Headers({
    'content-type': 'application/rss+xml; charset=UTF-8',
    'cache-control': `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=${ttl}`,
  });

  if (method === 'HEAD') {
    return new Response(null, {
      headers,
    });
  }

  return new Response(xml, {
    headers,
  });
}

function createErrorResponse(message, status) {
  return new Response(message, {
    status,
    headers: {
      'content-type': 'text/plain; charset=UTF-8',
      'cache-control': 'no-store',
    },
  });
}

function resolveCacheTtl(env) {
  const raw = Number(env?.RSS_CACHE_TTL);

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_CACHE_TTL;
  }

  return Math.floor(raw);
}

function resolveSiteUrl(env, requestUrl) {
  const envSiteUrl = env?.NEXT_PUBLIC_SITE_URL || env?.SITE_URL;
  const normalizedEnvSiteUrl = normalizeAbsoluteUrl(envSiteUrl);
  if (normalizedEnvSiteUrl) {
    return normalizedEnvSiteUrl;
  }

  return `${requestUrl.origin}`;
}

function normalizeFeedUrl(siteUrl) {
  return new URL('rss', ensureTrailingSlash(siteUrl)).toString();
}

function normalizeAbsoluteUrl(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  try {
    return new URL(value).toString().replace(/\/$/u, '');
  } catch {
    return '';
  }
}

async function fetchAllMoments(apiBaseUrl) {
  const moments = [];
  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    if (currentPage > MAX_PAGE_COUNT) {
      throw new Error('Pagination guard triggered while generating RSS.');
    }

    const pageUrl = new URL('moment/public', ensureTrailingSlash(apiBaseUrl));
    pageUrl.searchParams.set('page', String(currentPage));
    pageUrl.searchParams.set('pageSize', String(DEFAULT_PAGE_SIZE));

    const response = await fetch(pageUrl.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch moments: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    const data = payload?.data;

    if (!data || !Array.isArray(data.moments)) {
      throw new Error('Unexpected response format from /moment/public.');
    }

    moments.push(...data.moments);
    hasNextPage = Boolean(data.hasNextPage);
    currentPage += 1;
  }

  return moments.sort((left, right) => {
    const leftTime = Date.parse(left?.create_time || '') || 0;
    const rightTime = Date.parse(right?.create_time || '') || 0;
    return rightTime - leftTime;
  });
}

function buildRssXml({ feedUrl, homeUrl, feedTitle, feedDescription, feedLanguage, moments }) {
  const latestTimestamp = moments[0]?.update_time || moments[0]?.create_time || new Date().toISOString();
  const itemsXml = moments.map((moment) => buildItemXml(moment, homeUrl)).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(feedTitle)}</title>`,
    `    <link>${escapeXml(homeUrl)}</link>`,
    `    <description>${escapeXml(feedDescription)}</description>`,
    `    <language>${escapeXml(feedLanguage)}</language>`,
    `    <lastBuildDate>${escapeXml(new Date(latestTimestamp).toUTCString())}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    '    <ttl>60</ttl>',
    itemsXml,
    '  </channel>',
    '</rss>',
  ].join('\n');
}

function buildItemXml(moment, homeUrl) {
  const itemUrl = new URL('moment', ensureTrailingSlash(homeUrl));
  itemUrl.searchParams.set('id', String(moment.id));

  const title = buildTitle(moment);
  const description = buildDescription(moment);
  const content = buildContent(moment);
  const categories = buildCategories(moment);
  const lines = [
    '    <item>',
    `      <title>${escapeXml(title)}</title>`,
    `      <link>${escapeXml(itemUrl.toString())}</link>`,
    `      <guid isPermaLink="true">${escapeXml(itemUrl.toString())}</guid>`,
    `      <pubDate>${escapeXml(toRssDate(moment.create_time))}</pubDate>`,
    `      <description>${escapeXml(description)}</description>`,
    `      <content:encoded><![CDATA[${wrapCdata(content)}]]></content:encoded>`,
  ];

  for (const category of categories) {
    lines.push(`      <category>${escapeXml(category)}</category>`);
  }

  lines.push('    </item>');
  return lines.join('\n');
}

function buildTitle(moment) {
  if (typeof moment?.title === 'string' && moment.title.trim()) {
    return moment.title.trim();
  }

  const text = getPlainText(moment?.content);
  if (text) {
    return truncate(text, 60);
  }

  const type = typeof moment?.attributes?.type === 'string' ? moment.attributes.type : 'moment';
  return `${capitalize(type)} #${moment?.id ?? ''}`.trim();
}

function buildDescription(moment) {
  const parts = [];
  const plainText = getPlainText(moment?.content);

  if (plainText) {
    parts.push(plainText);
  }

  const music = moment?.attributes?.music;
  const musicInfo = [music?.name, music?.singer].filter(Boolean).join(' - ');
  if (musicInfo) {
    parts.push(`Music: ${musicInfo}`);
  }

  const publishedAt = safeIsoDate(moment?.create_time);
  if (publishedAt) {
    parts.push(`Published: ${publishedAt}`);
  }

  return truncate(parts.join(' '), 180) || `Moment #${moment?.id ?? ''}`;
}

function buildContent(moment) {
  const sections = [];

  if (typeof moment?.title === 'string' && moment.title.trim()) {
    sections.push(`<h1>${escapeXml(moment.title.trim())}</h1>`);
  }

  const textContent = renderTextContent(moment?.content);
  if (textContent) {
    sections.push(textContent);
  }

  const imageUrls = collectImageUrls(moment);
  for (const imageUrl of imageUrls.slice(0, 8)) {
    sections.push(`<p><img src="${escapeXml(imageUrl)}" alt="" /></p>`);
  }

  const music = moment?.attributes?.music;
  if (music?.name || music?.singer || music?.url) {
    const musicParts = [music.name, music.singer].filter(Boolean).map(escapeXml);
    if (musicParts.length) {
      sections.push(`<p>Music: ${musicParts.join(' - ')}</p>`);
    }

    if (music.url) {
      sections.push(`<p><a href="${escapeXml(music.url)}">Listen</a></p>`);
    }
  }

  const publishedAt = safeIsoDate(moment?.create_time);
  if (publishedAt) {
    sections.push(`<p>Published: ${escapeXml(publishedAt)}</p>`);
  }

  if (!sections.length) {
    return `<p>${escapeXml(`Moment #${moment?.id ?? ''}`)}</p>`;
  }

  return sections.join('\n');
}

function buildCategories(moment) {
  const categories = [];

  if (typeof moment?.attributes?.type === 'string' && moment.attributes.type) {
    categories.push(moment.attributes.type);
  }

  if (moment?.author?.name) {
    categories.push(moment.author.name);
  }

  return categories;
}

function renderTextContent(value) {
  const text = getPlainText(value);
  if (!text) {
    return '';
  }

  const paragraphs = text.split(/\n{2,}/u).filter(Boolean);
  return paragraphs.map((paragraph) => {
    return `<p>${escapeXml(paragraph).replace(/\n/gu, '<br />')}</p>`;
  }).join('\n');
}

function getPlainText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\r\n/gu, '\n').trim();
}

function collectImageUrls(moment) {
  const urls = [];
  const attributes = moment?.attributes;

  if (Array.isArray(attributes?.photosets)) {
    for (const photo of attributes.photosets) {
      if (photo?.url) {
        urls.push(photo.url);
      }
    }
  }

  if (attributes?.video?.cover) {
    urls.unshift(attributes.video.cover);
  }

  if (attributes?.music?.cover) {
    urls.unshift(attributes.music.cover);
  }

  return Array.from(new Set(urls.filter(Boolean)));
}

function safeIsoDate(value) {
  const timestamp = Date.parse(value || '');

  if (!Number.isFinite(timestamp)) {
    return '';
  }

  return new Date(timestamp).toISOString();
}

function toRssDate(value) {
  const timestamp = Date.parse(value || '');

  if (!Number.isFinite(timestamp)) {
    return new Date().toUTCString();
  }

  return new Date(timestamp).toUTCString();
}

function truncate(value, maxLength) {
  if (typeof value !== 'string' || value.length <= maxLength) {
    return value || '';
  }

  if (maxLength <= 3) {
    return value.slice(0, maxLength);
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function capitalize(value) {
  if (!value) {
    return '';
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function wrapCdata(value) {
  return String(value).split(']]>').join(']]]]><![CDATA[>');
}

function ensureTrailingSlash(value) {
  return /\/$/u.test(value) ? value : `${value}/`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&apos;');
}
