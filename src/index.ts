import { getNewFeedItems } from '@/getNewFeedItems'
import { getFeedUrlList } from '@/getFeedUrlList'
import { addFeedItems } from '@/addFeedItems'
import dotenv from 'dotenv'
dotenv.config()

async function index() {
  const feedUrlList = await getFeedUrlList()
  feedUrlList.forEach(async (feedUrl: string) => {
    if (feedUrl) {
      try {
        const newFeedItems = await getNewFeedItems(feedUrl)
        if (newFeedItems != null) await addFeedItems(newFeedItems)
      } catch (error) {
        // TODO: Provide some kind of notification to the user.
        console.error('Unexpected error', error)
        process.exit(1)
      }
    }
  })
}

index()
