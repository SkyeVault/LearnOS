import { getApp, resetNavigation } from "../nav"
import { createHousehold, getLearners, setGuardianCredentials, setLearnerCredentials } from "../app/store"
import { seedPrototypeAdults } from "../app/parent-controls"
import { renderProfilePicker } from "./profiles"

const prototypePassword = "12341234"

export function renderSetup() {
  getApp().innerHTML = `
    <main class="os-shell os-setup">
      <div class="os-brand"><span class="setup-brand-mark"></span><span>LearnOS</span><small>0.26</small></div>
      <section class="os-card">
        <p class="os-kicker">WELCOME, GROWN-UPS</p>
        <h1>Set up your learning home</h1>
        <p>This prototype creates four starter accounts and keeps everything on this device.</p>
        <form id="setup-form" class="os-form">
          <label>Home name<input required maxlength="40" id="home-name" placeholder="The Rivera Learning Home"></label>
          <label>First learner’s name<input required maxlength="30" id="learner-name" placeholder="Avery"></label>
          <p class="setup-note"><strong>Prototype sign-ins:</strong> admin, student, teacher, and parent. Password for each: <code>12341234</code>.</p>
          <button class="os-primary" type="submit">Create learning home →</button>
        </form>
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
