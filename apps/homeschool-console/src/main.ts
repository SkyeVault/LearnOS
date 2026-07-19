import './style.css'
import './overhaul.css'
import { applyTheme } from './app/themes'
import { resetNavigation } from './nav'
import { renderHome } from './pages/home'
import { isConfigured } from './app/store'
import { renderSetup } from './pages/setup'
import { installKioskExitGuard } from './app/kiosk'
import { getActiveWorkspace, getSignedInUser } from './app/session'
import { renderTeacherTools } from './pages/teacher-tools'
import { renderParentDashboard } from './pages/parent-controls'
import { renderFamilyHub } from './pages/family-hub'

applyTheme()
installKioskExitGuard()

const signedIn = getSignedInUser()
const workspace = getActiveWorkspace()
const startupPage = !isConfigured()
  ? renderSetup
  : signedIn && workspace === 'teacher'
    ? renderTeacherTools
    : signedIn?.role === 'Teacher'
    ? renderTeacherTools
    : signedIn?.role === 'Admin'
      ? renderParentDashboard
      : signedIn && ['Parent', 'Guardian'].includes(signedIn.role)
        ? renderFamilyHub
      : renderHome

resetNavigation(startupPage)
