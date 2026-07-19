type PageFn = () => void

const stack: PageFn[] = []

export function navigate(page: PageFn) {
  stack.push(page)
  page()
}

export function resetNavigation(page: PageFn) {
  stack.length = 0
  stack.push(page)
  page()
}

export function goBack() {
  if (stack.length <= 1) return
  stack.pop()
  const prev = stack[stack.length - 1]
  if (prev) prev()
}

export function getApp(): HTMLDivElement {
  return document.querySelector<HTMLDivElement>('#app')!
}
