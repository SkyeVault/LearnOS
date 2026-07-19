import { getSignedInUser } from './session'
import { adultsForLearner, classesForTeacher, getClasses } from './parent-controls'

export function signedAccountId() { return getSignedInUser()?.accountKey ?? '' }
export function isAdmin() { return getSignedInUser()?.role === 'Admin' }
export function canManageClass(classId: string) {
  const user = getSignedInUser()
  if (!user) return false
  if (user.role === 'Admin') return getClasses().some(group => group.id === classId)
  return user.role === 'Teacher' && classesForTeacher(user.accountKey.replace('adult:', '')).some(group => group.id === classId)
}
export function canViewLearner(learnerId: string) {
  const user = getSignedInUser()
  if (!user) return false
  if (user.role === 'Admin') return true
  if (user.role === 'Learner') return user.accountKey === `learner:${learnerId}`
  if (user.role === 'Teacher') return classesForTeacher(user.accountKey.replace('adult:', '')).some(group => group.learnerIds.includes(learnerId))
  return (user.role === 'Parent' || user.role === 'Guardian') && adultsForLearner(learnerId).some(adult => `adult:${adult.id}` === user.accountKey)
}
export function canSendToLearner(learnerId: string) {
  const user = getSignedInUser()
  return Boolean(user && (user.role === 'Admin' || (user.role === 'Teacher' && canViewLearner(learnerId))))
}
