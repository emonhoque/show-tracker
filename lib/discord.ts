interface ShowData {
  id: string
  title: string
  date_time: string
  venue: string
  city: string
}

interface DiscordNotificationPayload {
  show: ShowData
}

interface DiscordApiResponse {
  success: boolean
  message?: string
  error?: string
}

class DiscordNotificationService {
  private baseUrl: string | undefined
  private timeout: number = 5000 // 5 seconds timeout

  constructor() {
    this.baseUrl = process.env.DISCORD_BOT_API_URL
  }

  /**
   * Check if Discord bot API is healthy
   */
  async checkHealth(): Promise<boolean> {
    if (!this.baseUrl) {
      console.warn('Discord bot API URL not configured')
      return false
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.timeout),
      })

      return response.ok
    } catch (error) {
      console.warn('Discord bot health check failed:', error)
      return false
    }
  }

  /**
   * Send notification for a new show
   */
  async notifyNewShow(show: ShowData): Promise<void> {
    if (!this.baseUrl) {
      console.warn('Discord bot API URL not configured, skipping notification')
      return
    }

    try {
      const payload: DiscordNotificationPayload = { show }
      
      const response = await fetch(`${this.baseUrl}/notify/new-show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Discord API error: ${response.status} ${errorData}`)
      }

      const result: DiscordApiResponse = await response.json()
      
      if (!result.success) {
        throw new Error(`Discord notification failed: ${result.error || result.message}`)
      }

      console.log(`Discord notification sent successfully for new show: ${show.title}`)
    } catch (error) {
      console.error('Failed to send Discord notification for new show:', error)
      // Don't throw - we don't want to fail the main operation
    }
  }

  /**
   * Send notification for an updated show
   */
  async notifyUpdatedShow(show: ShowData): Promise<void> {
    if (!this.baseUrl) {
      console.warn('Discord bot API URL not configured, skipping notification')
      return
    }

    try {
      const payload: DiscordNotificationPayload = { show }
      
      const response = await fetch(`${this.baseUrl}/notify/updated-show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Discord API error: ${response.status} ${errorData}`)
      }

      const result: DiscordApiResponse = await response.json()
      
      if (!result.success) {
        throw new Error(`Discord notification failed: ${result.error || result.message}`)
      }

      console.log(`Discord notification sent successfully for updated show: ${show.title}`)
    } catch (error) {
      console.error('Failed to send Discord notification for updated show:', error)
      // Don't throw - we don't want to fail the main operation
    }
  }

  /**
   * Get notification status from Discord bot
   */
  async getNotificationStatus(): Promise<DiscordApiResponse | null> {
    if (!this.baseUrl) {
      console.warn('Discord bot API URL not configured')
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/notification/status`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.timeout),
      })

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get Discord notification status:', error)
      return null
    }
  }

  /**
   * Send notification asynchronously (fire and forget)
   */
  async sendNotificationAsync(type: 'new-show' | 'updated-show', show: ShowData): Promise<void> {
    // Fire and forget - don't await to avoid blocking the main operation
    setImmediate(async () => {
      try {
        if (type === 'new-show') {
          await this.notifyNewShow(show)
        } else {
          await this.notifyUpdatedShow(show)
        }
      } catch (error) {
        console.error(`Async Discord notification failed for ${type}:`, error)
      }
    })
  }
}

// Create singleton instance
export const discordService = new DiscordNotificationService()

// Export types for use in other modules
export type { ShowData, DiscordNotificationPayload }