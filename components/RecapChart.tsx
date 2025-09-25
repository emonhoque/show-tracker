'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatNameForDisplay } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp } from 'lucide-react'

interface ChartData {
  name: string
  displayName: string
  monthlyCounts: number[]
  color: string
}

interface RecapChartProps {
  data: ChartData[]
  year: number
}

export function RecapChart({ data }: RecapChartProps) {
  const [chartType, setChartType] = useState<'grid' | 'line'>('line')
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No data available for the chart
      </div>
    )
  }

  // Transform data for Recharts
  const chartData = monthNames.map((month, index) => {
    const dataPoint: Record<string, string | number> = { month }
    
    // Sort users by their count for this month (descending)
    const sortedUsers = [...data].sort((a, b) => b.monthlyCounts[index] - a.monthlyCounts[index])
    
    sortedUsers.forEach(user => {
      dataPoint[formatNameForDisplay(user.displayName)] = user.monthlyCounts[index]
    })
    
    return dataPoint
  })

  return (
    <div className="space-y-4">
      {/* Chart type toggle - Mobile first */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-semibold text-sm sm:text-base">Monthly Show Attendance</h4>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Line Chart</span>
          </Button>
          <Button
            variant={chartType === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('grid')}
            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Monthly View</span>
          </Button>
        </div>
      </div>

      {/* Mobile-optimized chart view */}
      {chartType === 'grid' && (
        <div className="space-y-4">
          {/* Desktop heatmap */}
          <div className="hidden sm:block space-y-4">
            {/* Month headers */}
            <div className="grid grid-cols-13 gap-1 text-xs font-medium text-muted-foreground">
              <div className="min-w-[140px]"></div> {/* Spacer for name column */}
              {monthNames.map((month, index) => (
                <div key={index} className="text-center py-1" title={month}>
                  {month}
                </div>
              ))}
            </div>
            
            {/* User data rows */}
            {data.map(user => {
              const totalShows = user.monthlyCounts.reduce((sum, count) => sum + count, 0)
              const maxMonth = Math.max(...user.monthlyCounts)
              const activeMonths = user.monthlyCounts.filter(count => count > 0).length
              
              return (
                <div key={user.name} className="space-y-2">
                  {/* User info and heatmap */}
                  <div className="grid grid-cols-13 gap-1 items-center">
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: user.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm">
                          {formatNameForDisplay(user.displayName)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {totalShows} total • {activeMonths} active
                        </div>
                      </div>
                    </div>
                    
                    {user.monthlyCounts.map((count, index) => {
                      const isPeak = count === maxMonth && count > 0
                      
                      return (
                        <div
                          key={index}
                          className={`aspect-square rounded text-xs flex items-center justify-center font-medium transition-all hover:scale-105 ${
                            isPeak 
                              ? 'bg-primary text-primary-foreground' 
                              : count > 0 
                              ? 'bg-muted text-foreground' 
                              : 'bg-muted/20 text-muted-foreground'
                          }`}
                          title={`${monthNames[index]}: ${count} show${count !== 1 ? 's' : ''}`}
                        >
                          {count > 0 ? count : ''}
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Monthly insights */}
                  {totalShows > 0 && (
                    <div className="text-xs text-muted-foreground ml-5">
                      {maxMonth > 0 && (
                        <span>
                          Peak: {monthNames[user.monthlyCounts.indexOf(maxMonth)]} ({maxMonth} show{maxMonth !== 1 ? 's' : ''})
                        </span>
                      )}
                      {activeMonths < 12 && (
                        <span className="ml-2">
                          • {12 - activeMonths} inactive month{12 - activeMonths !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {data.map(user => {
              const totalShows = user.monthlyCounts.reduce((sum, count) => sum + count, 0)
              const maxMonth = Math.max(...user.monthlyCounts)
              const activeMonths = user.monthlyCounts.filter(count => count > 0).length
              const peakMonthIndex = user.monthlyCounts.indexOf(maxMonth)
              
              return (
                <div key={user.name} className="bg-card border border-border rounded-lg p-4 space-y-3">
                  {/* User header */}
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-base">
                        {formatNameForDisplay(user.displayName)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalShows} total • {activeMonths} active months
                      </div>
                    </div>
                  </div>
                  
                  {/* Monthly breakdown */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Monthly Breakdown</div>
                    <div className="grid grid-cols-4 gap-2">
                      {user.monthlyCounts.map((count, index) => {
                        const isPeak = count === maxMonth && count > 0
                        return (
                          <div
                            key={index}
                            className={`p-2 rounded text-center ${
                              isPeak 
                                ? 'bg-primary text-primary-foreground' 
                                : count > 0 
                                ? 'bg-muted text-foreground' 
                                : 'bg-muted/20 text-muted-foreground'
                            }`}
                          >
                            <div className="text-xs font-medium">{monthNames[index]}</div>
                            <div className="text-sm font-bold">{count}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Insights */}
                  {totalShows > 0 && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {maxMonth > 0 && (
                        <div>
                          Peak month: {monthNames[peakMonthIndex]} ({maxMonth} show{maxMonth !== 1 ? 's' : ''})
                        </div>
                      )}
                      {activeMonths < 12 && (
                        <div>
                          {12 - activeMonths} inactive month{12 - activeMonths !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Line chart view - Mobile first */}
      {chartType === 'line' && (
        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 20, left: 15, bottom: 15 }}>
              <CartesianGrid strokeDasharray="1 1" stroke="hsl(var(--muted))" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={25}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                  fontSize: '11px',
                  padding: '6px 10px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  backdropFilter: 'blur(8px)',
                  maxWidth: '200px'
                }}
                labelStyle={{ 
                  fontWeight: '500',
                  color: 'hsl(var(--popover-foreground))',
                  fontSize: '11px'
                }}
                wrapperStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '10px', 
                  paddingTop: '8px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                iconType="line"
              />
              {data.map(user => (
                <Line
                  key={user.name}
                  type="monotone"
                  dataKey={formatNameForDisplay(user.displayName)}
                  stroke={user.color}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: user.color }}
                  activeDot={{ r: 4, stroke: user.color, strokeWidth: 2 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Accessibility text */}
      <div className="sr-only">
        {data.map(user => {
          const monthlyText = user.monthlyCounts.map((count, index) => 
            `${monthNames[index]}: ${count}`
          ).join(', ')
          return `${formatNameForDisplay(user.displayName)}: ${monthlyText}`
        }).join('; ')}
      </div>

      {/* Chart description */}
      <p className="text-xs text-muted-foreground">
        Counts exclude Maybe and Not going
      </p>
    </div>
  )
}