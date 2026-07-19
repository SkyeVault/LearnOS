import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { EventCalendar } from '@mui/x-scheduler/event-calendar'
import type { SchedulerEvent } from '@mui/x-scheduler/models'
import { calendarForCurrentUser } from "../features/calendar-store"

type LessonPlan = { id:string; classId:string; date:string; period:string; subject:string; title:string; objective:string; outline:string; slides:string; createdAt:string }
const planKey = 'learning-world-os:teacher-lesson-plans:v2'
let root: Root | null = null

const theme = createTheme({ palette: { primary: { main: '#3657b3' } }, shape: { borderRadius: 10 } })
const readPlans = (): LessonPlan[] => { try { return JSON.parse(localStorage.getItem(planKey) ?? '[]') as LessonPlan[] } catch { return [] } }
const writePlans = (items: LessonPlan[]) => localStorage.setItem(planKey, JSON.stringify(items))
const toEvent = (plan: LessonPlan): SchedulerEvent => ({ id: plan.id, title: plan.title, description: `${plan.subject}\n${plan.objective}`, start: `${plan.date || new Date().toISOString().slice(0, 10)}T09:00:00`, end: `${plan.date || new Date().toISOString().slice(0, 10)}T10:00:00`, allDay: false, color: 'blue' })

function Calendar() {
  const [events, setEvents] = useState<SchedulerEvent[]>(() => {
    const planEvents = readPlans().map(toEvent)
    const sharedEvents = calendarForCurrentUser().filter(entry => !planEvents.some(event => String(event.id) === entry.id)).map(entry => ({ id: entry.id, title: entry.title, description: entry.detail, start: entry.date, end: entry.date, allDay: false, color: entry.scope === 'personal' ? 'purple' : 'green' } as SchedulerEvent))
    return [...planEvents, ...sharedEvents]
  })
  const eventsRef = useRef(events)
  const containerRef = useRef<HTMLDivElement>(null)
  eventsRef.current = events

  useEffect(() => {
    const target = containerRef.current
    if (!target) return
    const timeout = window.setTimeout(() => {
      let scrollable: HTMLElement | null = null
      target.querySelectorAll<HTMLElement>('div').forEach(element => {
        const style = window.getComputedStyle(element)
        if (!scrollable && (style.overflowY === 'auto' || style.overflowY === 'scroll') && element.scrollHeight > element.clientHeight + 50) scrollable = element
      })
      const scrollTarget = scrollable as HTMLElement | null
      if (scrollTarget) scrollTarget.scrollTop = scrollTarget.scrollHeight * (7 / 24)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [events.length])

  const handleEventsChange = useCallback((next: SchedulerEvent[]) => {
    setEvents(next)
    const existing = readPlans()
    const nextIds = new Set(next.map(event => String(event.id)))
    const retained = existing.filter(plan => nextIds.has(plan.id))
    const changed = next.map(event => {
      const prior = existing.find(plan => plan.id === String(event.id))
      const date = String(event.start).slice(0, 10)
      return prior ? { ...prior, title: event.title, date } : { id: String(event.id), classId: '', date, period: '', subject: 'General', title: event.title, objective: event.description ?? '', outline: '', slides: '', createdAt: new Date().toISOString() }
    })
    writePlans([...changed, ...retained.filter(plan => !changed.some(item => item.id === plan.id))])
  }, [])

  const calendar = useMemo(() => <EventCalendar events={events} onEventsChange={handleEventsChange} />, [events, handleEventsChange])
  return <ThemeProvider theme={theme}><CssBaseline enableColorScheme={false} /><div ref={containerRef} className="mui-teacher-calendar">{calendar}</div></ThemeProvider>
}

export function mountTeacherCalendar(target: HTMLElement) {
  root?.unmount()
  root = createRoot(target)
  root.render(<Calendar />)
}
