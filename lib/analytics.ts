import { BetaAnalyticsDataClient } from '@google-analytics/data'

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

const propertyId = `properties/${process.env.GA_PROPERTY_ID}`

export async function getAnalyticsData() {
  try {
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'totalRevenue' },
      ],
    })

    const row = response.rows?.[0]

    return {
      users: row?.metricValues?.[0]?.value || '0',
      sessions: row?.metricValues?.[1]?.value || '0',
      revenue: row?.metricValues?.[2]?.value || '0',
    }
  } catch (error) {
    console.error('GA error:', error)
    throw error
  }
}