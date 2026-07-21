import { getApp, resetNavigation } from "../nav"
import { createHousehold, getLearners, setGuardianCredentials, setLearnerCredentials } from "../app/store"
import { seedPrototypeAdults } from "../app/parent-controls"
import { renderProfilePicker } from "./profiles"

const prototypePassword = "12341234"

export function renderSetup() {
  getApp().innerHTML = `
    <main class="os-shell os-setup setup-screen">
      <span class="setup-orbit setup-orbit-one" aria-hidden="true">✦</span>
      <span class="setup-orbit setup-orbit-two" aria-hidden="true">●</span>
      <section class="os-card setup-card">
        <header class="setup-card-header">
          <div class="os-brand"><span class="setup-brand-mark"></span><span>LearnOS</span></div>
          <span class="setup-local-badge">Local-first</span>
        </header>
        <div class="setup-card-body">
          <p class="os-kicker">WELCOME, GROWN-UPS</p>
          <h1>Set up your learning home</h1>
          <p class="setup-intro">A private, calm place to plan, learn, and keep the moments that matter. Everything begins on this device.</p>
          <form id="setup-form" class="os-form setup-form">
            <label><span>Home name</span><input required maxlength="40" id="home-name" placeholder="Our learning home"></label>
            <label><span>First learner’s name</span><input required maxlength="30" id="learner-name" placeholder="Learner name"></label>
            <aside class="setup-note"><span aria-hidden="true">✦</span><div><strong>After setup, sign in as <code>admin</code></strong><p>Password: <code>12341234</code>. From Admin Corner, you can manage the other local accounts.</p></div></aside>
            <button class="os-primary" type="submit">Create learning home <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>
    </main>`

  document.getElementById("setup-form")!.addEventListener("submit", async event => {
    event.preventDefault()
    const home = (document.getElementById("home-name") as HTMLInputElement).value
    const learnerName = (document.getElementById("learner-name") as HTMLInputElement).value
    await createHousehold(home, prototypePassword, learnerName)
    await setGuardianCredentials("admin", prototypePassword)
    const firstLearner = getLearners()[0]
    if (firstLearner) {
      await setLearnerCredentials(firstLearner.id, "student", prototypePassword)
      await seedPrototypeAdults(firstLearner.id)
    }
    resetNavigation(renderProfilePicker)
  })
}
