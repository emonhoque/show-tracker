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

export function RecapChart({ data, year }: RecapChartProps) {
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
    const dataPoint: any = { month }
    
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
            <span className="hidden xs:inline">Line</span>
          </Button>
          <Button
            variant={chartType === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('grid')}
            className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Grid</span>
          </Button>
        </div>
      </div>

      {/* Grid chart view - Mobile first */}
      {chartType === 'grid' && (
        <div className="space-y-4">
          {/* Month headers */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"></div> {/* Spacer for name column */}
            {monthNames.map((month, index) => (
              <div 
                key={index}
                className="w-5 h-5 sm:w-6 sm:h-6 text-xs flex items-center justify-center font-medium text-muted-foreground flex-shrink-0 border border-transparent"
                title={month}
              >
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    />
                    <div className="min-w-0 sm:min-w-[120px]">
                      <span className="font-medium text-sm sm:text-base truncate block">
                        {formatNameForDisplay(user.displayName)}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {totalShows} total • {activeMonths} active months
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {user.monthlyCounts.map((count, index) => (
                      <div 
                        key={index}
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-xs flex items-center justify-center border rounded flex-shrink-0 transition-colors ${
                          count === maxMonth && count > 0 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : count > 0 
                            ? 'bg-muted text-foreground' 
                            : 'bg-background text-muted-foreground'
                        }`}
                        title={`${monthNames[index]}: ${count} show${count !== 1 ? 's' : ''}`}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Monthly insights */}
                {totalShows > 0 && (
                  <div className="text-xs text-muted-foreground ml-5 sm:ml-6">
                    {maxMonth > 0 && (
                      <span>
                        Peak month: {monthNames[user.monthlyCounts.indexOf(maxMonth)]} ({maxMonth} show{maxMonth !== 1 ? 's' : ''})
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
        Counts use Boston time and exclude Maybe and Not going
      </p>
    </div>
  )
}