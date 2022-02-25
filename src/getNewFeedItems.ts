import Parser from 'rss-parser'
import { timeDifference } from './helpers'

const parser = new Parser()

export const getNewFeedItems = async (feedUrl: string) => {
  try {
    const { items: newFeedItems } = await parser.parseURL(feedUrl)

    return newFeedItems.filter((feedItem) => {
      const { pubDate } = feedItem

      if (!pubDate) return false

      const publishedDate = new Date(pubDate).getTime() / 1000
      const { diffInHours } = timeDifference(publishedDate)
      return diffInHours === 0
    })
  } catch (error) {
    console.warn('Failed to parse ' + feedUrl, error)
    console.log(`::warning:: Failed to parse feed '${feedUrl}'`)
    return null
  }
}
