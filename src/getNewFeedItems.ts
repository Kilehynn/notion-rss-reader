import Parser from 'rss-parser'
import { timeDifference } from './helpers'
import fetch from 'node-fetch'

const parser = new Parser()

export const getNewFeedItems = async (feedUrl: string) => {
  try {
    const content = await fetch(feedUrl, { redirect: 'follow' })
    if (content.status > 299)
      throw new Error(
        `Error fetching feed: ${content.status}, ${
          content.statusText
        }. Content: ${await content.text()}`
      )
    const { items: newFeedItems } = await parser.parseString(
      await content.text()
    )

    return newFeedItems.filter((feedItem) => {
      const { pubDate } = feedItem

      if (!pubDate) return false

      const publishedDate = new Date(pubDate).getTime() / 1000
      const { diffInHours } = timeDifference(publishedDate)
      return diffInHours < 24
    })
  } catch (error) {
    console.warn('Failed to parse ' + feedUrl, error)
    console.log(`::warning:: Failed to parse feed '${feedUrl}'`)
    return null
  }
}
