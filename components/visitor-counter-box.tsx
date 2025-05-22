"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CounterData {
  today: number
  yesterday: number
  all: number
  online: number
}

export function VisitorCounterBox() {
  const [counterData, setCounterData] = useState<CounterData>({
    today: 0,
    yesterday: 0,
    all: 0,
    online: 0,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // This would normally fetch data from the counter service
    // For now, we'll simulate it with some random numbers
    const fetchCounterData = () => {
      // Simulate loading delay
      setTimeout(() => {
        setCounterData({
          today: Math.floor(Math.random() * 100) + 10,
          yesterday: Math.floor(Math.random() * 200) + 50,
          all: Math.floor(Math.random() * 10000) + 1000,
          online: Math.floor(Math.random() * 20) + 1,
        })
        setIsLoaded(true)
      }, 1000)
    }

    fetchCounterData()
    
  }, [])

  return (
    <div className="inline-block">
      <Card className="border-primary/20 overflow-hidden w-[220px] shadow-none">
        <CardHeader className="bg-primary/10 py-2 px-3">
          <CardTitle className="text-sm font-medium text-center">Visitor Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-primary/10">
                <td className="py-1 px-3">Today</td>
                <td className="py-1 px-3 text-right">{isLoaded ? counterData.today : "..."}</td>
              </tr>
              <tr className="border-b border-primary/10">
                <td className="py-1 px-3">Yesterday</td>
                <td className="py-1 px-3 text-right">{isLoaded ? counterData.yesterday : "..."}</td>
              </tr>
              <tr className="border-b border-primary/10">
                <td className="py-1 px-3">All</td>
                <td className="py-1 px-3 text-right">{isLoaded ? counterData.all : "..."}</td>
              </tr>
              <tr>
                <td className="py-1 px-3">Online</td>
                <td className="py-1 px-3 text-right">{isLoaded ? counterData.online : "..."}</td>
              </tr>
            </tbody>
          </table>
          <div className="w-full text-center mt-1">
            <span className="text-[10px] text-muted-foreground">powered by Free-Counters</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
