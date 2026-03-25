# EdgeOne RSS

This project can expose a dynamic RSS feed through EdgeOne Pages Cloud Functions.

## Route

- Function file: `cloud-functions/rss/index.js`
- Public URL: `/rss`

## Required environment variables

- `NEXT_PUBLIC_HOMEPAGE_API` or `HOMEPAGE_API`: public moment API base URL

## Optional environment variables

- `NEXT_PUBLIC_SITE_URL` or `SITE_URL`: preferred canonical site URL for feed item links
- `RSS_FEED_TITLE`: feed title, defaults to `Yoniu Moment`
- `RSS_FEED_DESCRIPTION`: feed description, defaults to `Latest public moments`
- `RSS_FEED_LANGUAGE`: feed language, defaults to `zh-CN`
- `RSS_CACHE_TTL`: edge cache TTL in seconds, defaults to `600`

## Local debug

Install the EdgeOne CLI and run local Pages debugging from the project root:

```bash
npm install -g edgeone
edgeone pages dev
```

Then visit `/rss`.

## Deploy

Push the repository to the remote branch used by EdgeOne Pages. During Pages build, EdgeOne will publish the static `dist` output and generate the `/rss` function route from the `cloud-functions` directory.
