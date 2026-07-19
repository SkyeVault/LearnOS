import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { authenticateAccount } from './store'

function isDesktopApp() { return '__TAURI_INTERNALS__' in window }

function openExitGuard() {
  if (document.getElementById('guardian-exit-guard')) return
  const guard = document.createElement('section')
  guard.id = 'guardian-exit-guard'
  guard.className = 'guardian-exit-guard'
  guard.setAttribute('role', 'dialog')
  guard.setAttribute('aria-modal', 'true')
  guard.setAttribute('aria-labelledby', 'guardian-exit-title')
  guard.innerHTML = `<form class="guardian-exit-card" id="guardian-exit-form" autocomplete="off"><p class="os-kicker">ADMINISTRATOR ACCESS</p><h1 id="guardian-exit-title">Leave LearnOS?</h1><p>Sign in with a administrator account to close the learning environment.</p><label for="guardian-exit-username">Username</label><input id="guardian-exit-username" type="text" maxlength="40" required autocomplete="username" autofocus><label for="guardian-exit-password">Password</label><input id="guardian-exit-password" type="password" minlength="8" maxlength="128" required autocomplete="current-password"><button class="os-primary" type="submit">Administrator sign-in & close</button><button class="text-button" type="button" id="guardian-exit-cancel">Keep learning</button><p class="parent-error" id="guardian-exit-error" aria-live="polite"></p></form>`
  document.body.append(guard)
  const username = guard.querySelector<HTMLInputElement>('#guardian-exit-username')!
  const password = guard.querySelector<HTMLInputElement>('#guardian-exit-password')!
  const remove = () => guard.remove()
  guard.querySelector<HTMLButtonElement>('#guardian-exit-cancel')!.addEventListener('click', remove)
  guard.addEventListener('click', event => { if (event.target === guard) remove() })
  guard.querySelector<HTMLFormElement>('#guardian-exit-form')!.addEventListener('submit', async event => {
    event.preventDefault()
    const primary = await authenticateAccount(username.value, password.value)
    password.value = ''
    const valid = primary?.role === 'Admin'
    if (!valid) { guard.querySelector('#guardian-exit-error')!.textContent = 'The administrator account is required to close LearnOS.'; password.focus(); return }
    await invoke('allow_guardian_exit')
    await getCurrentWindow().close()
  })
  username.focus()
}

export function installKioskExitGuard() {
  if (!isDesktopApp()) return
  void listen('learnos://exit-requested', openExitGuard)
}
