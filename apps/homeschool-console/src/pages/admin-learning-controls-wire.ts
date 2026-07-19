import { setLearnerSubjectAccess, subjectTabs } from '../app/parent-controls'
import { assignModule, installedModules, unassignModule } from '../features/modules'

export function wireLearnerLearningControls(learnerId: string, rerender: () => void) {
  document.getElementById('learner-module-access')?.addEventListener('submit', event => {
    event.preventDefault()
    const chosen = new Set([...document.querySelectorAll<HTMLInputElement>('#learner-module-access input:checked')].map(input => input.value))
    installedModules().filter(module => !module.core).forEach(module => chosen.has(module.id) ? assignModule(learnerId, module.id) : unassignModule(learnerId, module.id))
    rerender()
  })
  document.getElementById('learner-material-access')?.addEventListener('submit', event => {
    event.preventDefault()
    const chosen = new Set([...document.querySelectorAll<HTMLInputElement>('#learner-material-access input:checked')].map(input => input.value))
    subjectTabs.forEach(subject => setLearnerSubjectAccess(learnerId, subject, chosen.has(subject)))
    rerender()
  })
}
