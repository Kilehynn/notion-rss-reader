import { Client } from '@notionhq/client'
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import ogp from 'ogp-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any

async function is_already_present_in_db(
  notion: Client,
  database_id: string,
  article_url: string
): Promise<boolean> {
  const response = await notion.databases.query({
    database_id: database_id,
    filter: {
      property: 'URL',
      url: {
        equals: article_url,
      },
    },
  })
  return response.results.length > 0
}

export const addFeedItems = async (
  newFeedItems: {
    [key: string]: TODO
  }[]
) => {
  const notion = new Client({ auth: process.env.NOTION_KEY })
  const databaseId = process.env.NOTION_READER_DATABASE_ID || ''

  newFeedItems.forEach(async (item) => {
    const { title, link, enclosure, pubDate } = item
    if (await is_already_present_in_db(notion, databaseId, link)) {
      return
    }
    const domain = link?.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)

    const properties: TODO = {
      Title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      URL: {
        url: link,
      },
      Domain: {
        select: {
          name: domain ? domain[1] : null,
        },
      },
      'Created At': {
        rich_text: [
          {
            text: {
              content: pubDate,
            },
          },
        ],
      },
    }

    const ogpImage = link
      ? await ogp(link).then((data) => {
          const imageList = data.ogp['og:image']
          return imageList ? imageList[0] : null
        })
      : ''

    const children: CreatePageParameters['children'] = enclosure
      ? [
          {
            type: 'image',
            image: {
              type: 'external',
              external: {
                url: enclosure?.url,
              },
            },
          },
        ]
      : ogpImage
      ? [
          {
            type: 'image',
            image: {
              type: 'external',
              external: {
                url: ogpImage,
              },
            },
          },
        ]
      : []

    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
        children,
      })
      console.log(`Added [${domain ? domain[1] : '?'}] ${title} (${link})`)
    } catch (error) {
      console.error(error)
    }
  })
}
