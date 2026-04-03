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
    // ── Query 1: métricas generales ──
    const [general] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'totalRevenue' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
    })

    // ── Query 2: páginas más vistas ──
    const [pages] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5,
    })

    // ── Query 3: dispositivos ──
    const [devices] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
    })

    const row = general.rows?.[0]
    const totalUsers = Number(row?.metricValues?.[0]?.value || 0)
    const newUsers = Number(row?.metricValues?.[5]?.value || 0)

    return {
      users: row?.metricValues?.[0]?.value || '0',
      sessions: row?.metricValues?.[1]?.value || '0',
      revenue: row?.metricValues?.[2]?.value || '0',
      bounceRate: row?.metricValues?.[3]?.value || '0',
      avgSessionDuration: row?.metricValues?.[4]?.value || '0',
      newUsers: String(newUsers),
      returningUsers: String(totalUsers - newUsers),

      topPages: (pages.rows ?? []).map(r => ({
        path: r.dimensionValues?.[0]?.value || '',
        title: r.dimensionValues?.[1]?.value || '',
        views: r.metricValues?.[0]?.value || '0',
      })),

      devices: (devices.rows ?? []).map(r => ({
        device: r.dimensionValues?.[0]?.value || '',
        sessions: r.metricValues?.[0]?.value || '0',
      })),
    }
  } catch (error) {
    console.error('GA error:', error)
    throw error
  }
}