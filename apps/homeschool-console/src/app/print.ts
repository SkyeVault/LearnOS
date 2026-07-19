import './print.css'

export function printCard(title: string, source: HTMLElement) {
  const root = document.createElement('section')
  root.id = 'learning-world-print-root'
  const copy = source.cloneNode(true) as HTMLElement
  copy.querySelectorAll('button, form, input, textarea, select, .no-print').forEach(element => element.remove())
  root.innerHTML = `<header><p>Learning World · Local Learning Handout</p><h1>${title}</h1><p>Printed ${new Date().toLocaleDateString()}</p></header>`
  root.append(copy)
  document.body.append(root)
  document.body.classList.add('learning-world-printing')
  const previousTitle = document.title
  document.title = title
  const clean = () => {
    root.remove()
    document.body.classList.remove('learning-world-printing')
    document.title = previousTitle
    window.removeEventListener('afterprint', clean)
  }
  window.addEventListener('afterprint', clean)
  window.print()
  window.setTimeout(clean, 1500)
}
