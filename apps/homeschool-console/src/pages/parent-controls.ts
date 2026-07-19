import { getApp, navigate } from "../nav"
import { getLearners, getSettings, setToddlerLockEnabled } from "../app/store"
import { clearSignedInUser, isAdministrator } from "../app/session"
import { addAdult, allowedSubjects, getParentControls, setLearnerSubjectAccess, subjectTabs } from "../app/parent-controls"
import { addAllowedDomain, getSourcePolicy, removeAllowedDomain, setSourceAccess } from "../app/parent-source-policy"
import { getPublicLibraryShortcut, removePublicLibraryShortcut, savePublicLibraryShortcut } from "../app/public-library-shortcut"
import { assignmentStats, createAssignment } from "../features/assignments-store"
import { addCurriculumPlan, curriculumPlansFor, getStateRequirementOverview, removeCurriculumPlan, saveStateRequirementOverview, stateRequirementPrompts, toggleStateRequirementPrompt } from "../features/curriculum-planner"
import { addSpiritContent, getSpiritContent, removeSpiritContent, type SpiritContentKind } from "../features/spirit-content"
import { inferLearningStage, learningStages, lessonsForStage, type LearningStage } from "../content/age-guided-lessons"
import { renderCreatorStudio } from "./creator-studio-v2"
import { renderAssignmentManager } from "./assignment-manager"
import { renderModuleManager } from "./module-manager"
import { renderTeacherTools } from "./teacher-tools"
import { renderFamilyHub } from "./family-hub"
import { renderThemeStudio } from "./theme-studio"
import { renderSoftwareGuide } from "./software-guide"
import { renderAdminResourceLibrary } from "./admin-resource-library"
import { renderCulturalLibrary } from "./cultural-library"
import { applyTheme } from "../app/themes"
import { escapeHtml } from "../app/html"
import { openUserManagement, renderProfilePicker, renderProfileSettings } from "./profiles"
import { renderClassRosters } from "./class-rosters"

export function renderParentControls() {
  if (isAdministrator()) renderParentDashboard()
  else renderProfilePicker()
}

export function renderParentDashboard(selectedLearnerId?: string, requestedStage?: LearningStage, requestedSubject?: string) {
  applyTheme('parent')
  const controls = getParentControls()
  const learners = getLearners()
  // An administrator lands in their own workspace, never silently inside the first learner's record.
  const selectedLearner = selectedLearnerId ? learners.find(learner => learner.id === selectedLearnerId) : undefined
  const stage = requestedStage ?? inferLearningStage(selectedLearner?.ageBand)
  const stageLessons = lessonsForStage(stage)
  const subjects = [...new Set(stageLessons.map(lesson => lesson.subject))].sort((a, b) => a.localeCompare(b))
  const subject = subjects.includes(requestedSubject ?? "") ? requestedSubject! : ""
  const referenceLessons = subject ? stageLessons.filter(lesson => lesson.subject === subject) : []
  const curriculumPlans = selectedLearner ? curriculumPlansFor(selectedLearner.id) : []
  const stats = selectedLearner ? assignmentStats(selectedLearner.id) : { total: 0, completed: 0, points: 0, available: 0 }
  const stateOverview = getStateRequirementOverview()
  const safeStateSource = /^https?:\/\//i.test(stateOverview.officialSourceUrl) ? stateOverview.officialSourceUrl : ""

  const learnerOptions = learners.map(learner => '<option value="' + escapeHtml(learner.id) + '"' + (learner.id === selectedLearner?.id ? " selected" : "") + ">" + escapeHtml(learner.avatar) + " " + escapeHtml(learner.name) + "</option>").join("")
  const stageOptions = learningStages.map(item => '<option value="' + escapeHtml(item.id) + '"' + (item.id === stage ? " selected" : "") + ">" + escapeHtml(item.id) + "</option>").join("")
  const curriculumSubjectOptions = subjects.map(item => '<option value="' + escapeHtml(item) + '"' + (item === subject ? " selected" : "") + ">" + escapeHtml(item) + "</option>").join("")
  const subjectReference = subjects.map(item => '<button type="button" class="plan-subject-chip" data-reference-subject="' + escapeHtml(item) + '" aria-pressed="' + String(item === subject) + '">' + escapeHtml(item) + "</button>").join("")
  const planCards = curriculumPlans.length
    ? '<div class="curriculum-plan-list">' + curriculumPlans.map(plan => '<article class="curriculum-plan-card"><div><span>' + escapeHtml(plan.subject) + " · " + escapeHtml(plan.stage) + '</span><h3>' + escapeHtml(plan.title) + '</h3><p>' + escapeHtml(plan.objective) + '</p><small>' + escapeHtml(plan.cadence) + (plan.resources.length ? " · " + plan.resources.length + " resource" + (plan.resources.length === 1 ? "" : "s") : "") + '</small></div><footer><button class="os-secondary" data-assign-curriculum="' + escapeHtml(plan.id) + '">Assign as goal</button><button class="text-button" data-remove-curriculum="' + escapeHtml(plan.id) + '">Remove</button></footer></article>').join("") + "</div>"
    : '<div class="curriculum-empty"><strong>This student plan belongs to your learning community.</strong><p>Add the subjects, materials, cadence, and outcomes you already want for this learner. Nothing is preselected for you.</p></div>'
  const referenceContent = subject
    ? '<div class="reference-lesson-list">' + referenceLessons.map(lesson => '<article><span>' + escapeHtml(lesson.subject) + '</span><h4>' + escapeHtml(lesson.title) + '</h4><p>' + escapeHtml(lesson.objective) + '</p><details><summary>See a possible structure</summary><p><strong>Materials:</strong> ' + lesson.materials.map(escapeHtml).join(", ") + '</p><ol>' + lesson.steps.map(step => "<li>" + escapeHtml(step) + "</li>").join("") + '</ol></details><button class="os-secondary" data-use-reference="' + escapeHtml(lesson.id) + '">Add to my curriculum</button></article>').join("") + "</div>"
    : '<p class="reference-empty">Choose a subject above to view a few optional, age-aligned starting points. Your curriculum stays front and center.</p>'
  const stateChecklist = stateRequirementPrompts.map(prompt => '<label class="state-requirement"><input type="checkbox" data-state-requirement="' + prompt.id + '"' + (stateOverview.completedPromptIds.includes(prompt.id) ? " checked" : "") + '><span><strong>' + escapeHtml(prompt.label) + '</strong><small>' + escapeHtml(prompt.detail) + "</small></span></label>").join("")
  const spiritItems = getSpiritContent().length ? getSpiritContent().map(item => '<li><strong>' + escapeHtml(item.title) + '</strong><span>' + (item.kind === "family" ? "Family shelf" : "Research studio") + " · " + (item.targetLearnerIds.length ? "Assigned to " + item.targetLearnerIds.map(id => escapeHtml(learners.find(learner => learner.id === id)?.name ?? "a removed learner")).join(", ") : "All learners") + '</span><button type="button" data-remove-spirit="' + escapeHtml(item.id) + '">Remove</button></li>').join("") : "<li>No Spirit content has been added yet.</li>"

  const curriculumSection = selectedLearner
    ? '<div class="plan-controls"><label><span>1 · Learner</span><select id="plan-learner">' + learnerOptions + '</select></label><label><span>2 · Age / grade stage</span><select id="plan-stage">' + stageOptions + '</select><small>' + escapeHtml(learningStages.find(item => item.id === stage)?.description ?? "") + '</small></label></div><section class="parent-curriculum-workspace"><div class="curriculum-owned"><div class="curriculum-section-heading"><div><p class="os-kicker">STUDENT OUTLINE</p><h3>' + escapeHtml(selectedLearner.name) + '’s plan</h3><p>Start with what your family has chosen. Add only the objectives, materials, and cadence that matter here.</p></div><div class="plan-stats"><strong>' + stats.completed + "/" + stats.total + '</strong><span>goals completed</span><small>' + stats.available + ' points waiting</small></div></div>' + planCards + '<form class="curriculum-form" id="curriculum-form"><strong>Add a curriculum piece</strong><label>Subject<select id="curriculum-subject">' + curriculumSubjectOptions + '</select></label><label>Title<input id="curriculum-title" required maxlength="100" placeholder="For example: Read-aloud and narration"></label><label>Learning objective<textarea id="curriculum-objective" required maxlength="900" placeholder="What will this learner understand, practice, or create?"></textarea></label><label>Cadence<input id="curriculum-cadence" maxlength="100" placeholder="For example: three times each week"></label><label>Resources <small>comma-separated</small><input id="curriculum-resources" maxlength="700" placeholder="Books, kits, community places, or materials"></label><button class="os-primary">Save to ' + escapeHtml(selectedLearner.name) + '’s plan</button><p class="parent-error" id="curriculum-error"></p></form></div><aside class="curriculum-reference"><p class="os-kicker">AGE-APPROPRIATE REFERENCE</p><h3>Subjects for ' + escapeHtml(stage) + '</h3><p>This is a planning map, not a prescribed curriculum. Tap a subject only when you want inspiration.</p><div class="plan-subject-chips">' + subjectReference + '</div><details class="optional-reference"' + (subject ? " open" : "") + '><summary>Optional inspiration ' + (subject ? "for " + escapeHtml(subject) : "") + '</summary>' + referenceContent + "</details></aside></section>"
    : '<div class="plan-controls"><label><span>Select a learner</span><select id="plan-learner"><option value="">Choose a learner…</option>' + learnerOptions + '</select><small>Open a learner only when you are ready to plan or review their work.</small></label></div><p class="reference-empty">This is the administrator workspace. Choose a learner to open their curriculum plan.</p>'

  getApp().innerHTML = '<main class="parent-dashboard admin-corner"><header><div><p class="os-kicker">ADMIN CORNER</p><h1>Shape each child’s learning world</h1><p class="admin-header-note">People, learning paths, and materials—organized from one calm home base.</p></div><div class="admin-header-menu"><button class="admin-menu-toggle" id="admin-menu-toggle" aria-expanded="false" aria-controls="admin-header-menu" title="Open admin menu"><span aria-hidden="true">☰</span><span>Menu</span></button><nav class="admin-menu-popover" id="admin-header-menu" hidden aria-label="Admin navigation"><button id="open-teacher-desk">Teacher Desk</button><button id="open-llm">LLM workspace</button><button id="open-living-library">Living Library</button><button id="open-family-hub">Family Hub calendar</button><button id="open-studio">Design Center</button><button id="open-software-guide">Software Guide</button><button class="admin-menu-logout" id="admin-logout">Log out</button></nav></div></header><section class="admin-command-center"><div class="admin-command-heading"><p class="os-kicker">ADMIN WORKFLOW</p><h2>Start with the next meaningful move.</h2><p>Set up the people, program, and learning materials your community needs today.</p></div><div class="admin-command-grid"><button class="admin-command" id="admin-add-family"><span>Family</span><strong>Add parent or guardian</strong><small>Create a permanent family link to a learner.</small></button><button class="admin-command" id="admin-add-student"><span>Students</span><strong>Add a student</strong><small>Create a learner account, stage, materials, and access.</small></button><button class="admin-command" id="admin-add-teacher"><span>Teachers</span><strong>Add a teacher</strong><small>Assign classes and student rosters from People & Access.</small></button><button class="admin-command" id="admin-manage-people"><span>Directory</span><strong>People & relationships</strong><small>Search accounts, families, teachers, classes, and enrollment.</small></button><button class="admin-command" id="admin-open-studio"><span>Materials</span><strong>Design Studio</strong><small>Create a handout, slide lesson, or locally sourced resource.</small></button><button class="admin-command" id="admin-open-modules"><span>Program</span><strong>Module Creator</strong><small>Choose and maintain the learning areas available to each student.</small></button></div></section><section class="parent-grid"><article class="parent-panel parent-learning-plan"><div class="plan-heading"><div><p class="os-kicker">STUDENT MATERIAL CONTROL</p><h2>Curriculum outline' + (selectedLearner ? " for " + escapeHtml(selectedLearner.name) : "") + '</h2><p>Build the plan you already have, use age as a reference, and turn the right pieces into trackable goals.</p></div></div>' + curriculumSection + '</article><article class="parent-panel state-overview-panel"><p class="os-kicker">STATE REQUIREMENT OVERVIEW</p><h2>Compliance notebook</h2><p>Requirements vary by location and can change. Keep your official source and your family’s checklist together here; this is a planning aid, not legal advice.</p><form id="state-overview-form" class="state-overview-form"><label>State or territory<input id="state-name" maxlength="60" value="' + escapeHtml(stateOverview.state) + '" placeholder="For example: North Carolina"></label><label>Official source URL <small>optional</small><input id="state-source-url" type="url" maxlength="500" value="' + escapeHtml(safeStateSource) + '" placeholder="https://..."></label><label>Parent notes<textarea id="state-notes" maxlength="1500" placeholder="What does your official source require?">' + escapeHtml(stateOverview.notes) + '</textarea></label><button class="os-secondary">Save overview</button><p class="parent-error" id="state-overview-error"></p></form>' + (safeStateSource ? '<a class="state-source-link" href="' + escapeHtml(safeStateSource) + '" target="_blank" rel="noreferrer">Open saved official source ↗</a>' : "") + '<div class="state-requirement-list">' + stateChecklist + '</div></article><article class="parent-panel toddler-lock-panel"><p class="os-kicker">EARLY LEARNING</p><h2>Toddler Lock</h2><p>Keep a young learner inside Early Learning. All play activities remain available; parent or guardian sign-in is required to leave.</p><label class="toggle-row"><input id="toddler-lock" type="checkbox"' + (getSettings()?.toddlerLockEnabled ? " checked" : "") + '><span>Require adult sign-in to leave Early Learning</span></label></article><article class="parent-panel"><h2>Adults in this home</h2><p>Add a parent, guardian, or teacher to your local household record.</p><div class="adult-list">' + (controls.adults.length ? controls.adults.map(adult => "<span>" + escapeHtml(adult.name) + " · " + escapeHtml(adult.role) + "</span>").join("") : "<span>Household administration is protected by role-based sign-in.</span>") + '</div><form id="add-adult"><input id="adult-name" required maxlength="50" placeholder="Adult name"><select id="adult-role"><option>Parent</option><option>Guardian</option><option>Teacher</option></select><button class="os-secondary">Add adult</button></form></article><article class="parent-panel"><h2>Internet inside Learning World</h2><p>Children stay local by default. Turn this on only for parent-guided source sessions.</p><label class="toggle-row"><input id="external-links" type="checkbox"' + (getSourcePolicy().enabled ? " checked" : "") + '><span>Allow parent-approved external source links</span></label></article><article class="parent-panel"><h2>Approved source domains</h2><p>Only these domains may open in a parent-guided session.</p><form id="add-domain"><input id="domain-name" required placeholder="example.org"><button class="os-secondary">Allow domain</button></form><div class="domain-list">' + getSourcePolicy().allowedDomains.map(domain => '<span class="domain-chip">' + escapeHtml(domain) + '<button data-remove-domain="' + escapeHtml(domain) + '" aria-label="Remove ' + escapeHtml(domain) + '">×</button></span>').join("") + '</div></article><article class="parent-panel public-library-panel"><h2>My public library</h2><p>Add your local library’s official link. It will appear as a direct, parent-selected doorway in Living Library.</p><form id="public-library-form"><input id="public-library-name" required maxlength="100" placeholder="Library name"><input id="public-library-url" required type="url" maxlength="500" placeholder="https://your-library.org"><button class="os-secondary">Save library link</button></form><div class="public-library-status"><span id="public-library-status"></span><button type="button" class="text-button" id="remove-public-library">Remove saved link</button></div><p id="public-library-error" class="parent-error"></p></article><article class="parent-panel parent-access"><h2>Child-safe subject access</h2>' + (selectedLearner ? '<label class="learner-picker">Configuring <select id="access-learner">' + learnerOptions + '</select></label><p>Choose the subjects ' + escapeHtml(selectedLearner.name) + ' can see.</p><div class="access-grid">' + subjectTabs.map(item => '<label><input type="checkbox" data-subject="' + escapeHtml(item) + '"' + (allowedSubjects(selectedLearner.id).includes(item) ? " checked" : "") + "> " + escapeHtml(item) + "</label>").join("") + "</div>" : "<p>Add a learner first.</p>") + '</article><article class="parent-panel spirit-parent-panel"><h2>Spirit & World-Religion Shelf</h2><p>Add only what this household wants to share. Assign it to all learners or one child.</p><form id="add-spirit-content"><label>Section<select id="spirit-kind"><option value="family">Family spiritual learning</option><option value="research">World religions research</option></select></label><label>Assign to<select id="spirit-audience"><option value="">All learners</option>' + learnerOptions + '</select></label><label>Title<input id="spirit-title" required maxlength="90" placeholder="A practice, question, or topic"></label><label>Tradition or lens <small>(optional)</small><input id="spirit-tradition" maxlength="60" placeholder="For example: family tradition or Buddhism"></label><label>Description<textarea id="spirit-description" required maxlength="900" placeholder="Share a reflection, guidance, or respectful research prompt."></textarea></label><label>Guiding question <small>(optional)</small><textarea id="spirit-question" maxlength="240" placeholder="What do you notice, wonder, or want to learn?"></textarea></label><label>Parent-approved source URL <small>(optional)</small><input id="spirit-source-url" type="url" placeholder="https://example.org"></label><button class="os-secondary">Add to Spirit</button><p id="spirit-content-error" class="parent-error"></p></form><ul class="spirit-parent-list">' + spiritItems + '</ul></article><article class="parent-panel"><h2>Local-first promise</h2><ul><li>Lessons and activity records live on this device.</li><li>External source buttons start off.</li><li>Family Archive records require rights and consent notes.</li><li>Use Creator Studio to adapt a local lesson seed.</li></ul></article></section></main>'

  document.querySelector(".parent-learning-plan")!.innerHTML = `<div class="plan-heading"><div><p class="os-kicker">PROGRAM PLANNING</p><h2>Classes, lessons & materials</h2><p>Build the operational structure for your program instead of a learner-specific outline.</p></div></div><div class="admin-planning-grid"><article><span>01</span><h3>Classes & rosters</h3><p>Create classes, assign teachers, and enroll learners through People & relationships.</p><button class="os-primary" id="admin-plan-classes">Manage classes</button></article><article><span>02</span><h3>Lesson plans</h3><p>Schedule a class lesson, outline the session, and publish it to the shared calendar.</p><button class="os-primary" id="admin-plan-lessons">Open lesson planner</button></article><article><span>03</span><h3>Shared resource library</h3><p>Upload files, add links, and share class materials with assigned teachers.</p><button class="os-primary" id="admin-plan-files">Open resource library</button></article></div>`
  document.querySelector(".admin-corner header h1")!.textContent = "Manage your learning community"
  document.getElementById("open-living-library")!.addEventListener("click", () => navigate(renderCulturalLibrary))
  document.getElementById("admin-menu-toggle")!.addEventListener("click", () => {
    const button = document.getElementById("admin-menu-toggle")!
    const menu = document.getElementById("admin-header-menu")!
    const open = menu.hidden
    menu.hidden = !open
    button.setAttribute("aria-expanded", String(open))
  })
  document.getElementById("open-teacher-desk")!.addEventListener("click", () => navigate(renderTeacherTools))
  document.getElementById("open-llm")!.addEventListener("click", () => navigate(() => renderTeacherTools("dashboard", true)))
  document.getElementById("open-studio")!.addEventListener("click", () => navigate(renderCreatorStudio))
  document.getElementById("admin-plan-classes")!.addEventListener("click", () => navigate(renderClassRosters))
  document.getElementById("admin-plan-lessons")!.addEventListener("click", () => navigate(() => renderTeacherTools("plans")))
  document.getElementById("admin-plan-files")!.addEventListener("click", () => navigate(renderAdminResourceLibrary))
  document.getElementById("admin-add-family")!.addEventListener("click", () => navigate(() => openUserManagement("family")))
  document.getElementById("admin-add-student")!.addEventListener("click", () => navigate(() => openUserManagement("learner")))
  document.getElementById("admin-add-teacher")!.addEventListener("click", () => navigate(() => openUserManagement("staff")))
  document.getElementById("admin-manage-people")!.addEventListener("click", () => navigate(renderProfileSettings))
  document.getElementById("admin-open-studio")!.addEventListener("click", () => navigate(renderCreatorStudio))
  document.getElementById("admin-open-modules")!.addEventListener("click", () => navigate(renderModuleManager))
  document.getElementById("open-assignments")?.addEventListener("click", () => navigate(renderAssignmentManager))
  document.getElementById("open-modules")?.addEventListener("click", () => navigate(renderModuleManager))
  document.getElementById("open-teacher-tools")?.addEventListener("click", () => navigate(renderTeacherTools))
  document.getElementById("open-family-hub")?.addEventListener("click", () => navigate(renderFamilyHub))
  document.getElementById("open-theme-studio")?.addEventListener("click", () => navigate(renderThemeStudio))
  document.getElementById("open-user-management")?.addEventListener("click", () => navigate(renderProfileSettings))
  document.getElementById("open-software-guide")!.addEventListener("click", () => navigate(renderSoftwareGuide))
  document.getElementById("admin-logout")!.addEventListener("click", () => { clearSignedInUser(); renderProfilePicker() })
  document.getElementById("toddler-lock")!.addEventListener("change", event => setToddlerLockEnabled((event.target as HTMLInputElement).checked))
  document.getElementById("external-links")!.addEventListener("change", event => setSourceAccess((event.target as HTMLInputElement).checked))
  document.getElementById("add-adult")!.addEventListener("submit", event => { event.preventDefault(); addAdult((document.getElementById("adult-name") as HTMLInputElement).value, (document.getElementById("adult-role") as HTMLSelectElement).value as "Parent" | "Guardian" | "Teacher"); renderParentDashboard(selectedLearner?.id, stage, subject) })
  document.getElementById("add-domain")!.addEventListener("submit", event => { event.preventDefault(); if (addAllowedDomain((document.getElementById("domain-name") as HTMLInputElement).value)) renderParentDashboard(selectedLearner?.id, stage, subject) })
  document.querySelectorAll<HTMLButtonElement>("[data-remove-domain]").forEach(button => button.addEventListener("click", () => { removeAllowedDomain(button.dataset.removeDomain!); renderParentDashboard(selectedLearner?.id, stage, subject) }))
  const publicLibrary = getPublicLibraryShortcut()
  document.getElementById("public-library-status")!.textContent = publicLibrary ? "Current shortcut: " + publicLibrary.name : "No public library link saved yet."
  document.getElementById("public-library-form")!.addEventListener("submit", event => {
    event.preventDefault()
    const saved = savePublicLibraryShortcut({ name: (document.getElementById("public-library-name") as HTMLInputElement).value, url: (document.getElementById("public-library-url") as HTMLInputElement).value })
    if (saved) renderParentDashboard(selectedLearner?.id, stage, subject)
    else document.getElementById("public-library-error")!.textContent = "Add a name and a complete http:// or https:// address."
  })
  document.getElementById("remove-public-library")!.addEventListener("click", () => { removePublicLibraryShortcut(); renderParentDashboard(selectedLearner?.id, stage, subject) })
  document.getElementById("access-learner")?.addEventListener("change", event => renderParentDashboard((event.target as HTMLSelectElement).value))
  if (selectedLearner) document.querySelectorAll<HTMLInputElement>("[data-subject]").forEach(input => input.addEventListener("change", () => setLearnerSubjectAccess(selectedLearner.id, input.dataset.subject!, input.checked)))
  document.getElementById("plan-learner")?.addEventListener("change", event => { const learnerId = (event.target as HTMLSelectElement).value; if (learnerId) renderParentDashboard(learnerId) })
  document.getElementById("plan-stage")?.addEventListener("change", event => renderParentDashboard(selectedLearner?.id, (event.target as HTMLSelectElement).value as LearningStage))
  document.querySelectorAll<HTMLButtonElement>("[data-reference-subject]").forEach(button => button.addEventListener("click", () => renderParentDashboard(selectedLearner?.id, stage, button.dataset.referenceSubject)))
  document.getElementById("curriculum-form")?.addEventListener("submit", event => {
    event.preventDefault()
    if (!selectedLearner) return
    const added = addCurriculumPlan({ learnerId: selectedLearner.id, stage, subject: (document.getElementById("curriculum-subject") as HTMLSelectElement).value, title: (document.getElementById("curriculum-title") as HTMLInputElement).value, objective: (document.getElementById("curriculum-objective") as HTMLTextAreaElement).value, cadence: (document.getElementById("curriculum-cadence") as HTMLInputElement).value, resources: (document.getElementById("curriculum-resources") as HTMLInputElement).value.split(",") })
    if (added) renderParentDashboard(selectedLearner.id, stage, subject)
    else document.getElementById("curriculum-error")!.textContent = "Add a subject, title, and learning objective."
  })
  document.querySelectorAll<HTMLButtonElement>("[data-remove-curriculum]").forEach(button => button.addEventListener("click", () => { removeCurriculumPlan(button.dataset.removeCurriculum!); renderParentDashboard(selectedLearner?.id, stage, subject) }))
  document.querySelectorAll<HTMLButtonElement>("[data-assign-curriculum]").forEach(button => button.addEventListener("click", () => {
    const plan = curriculumPlans.find(item => item.id === button.dataset.assignCurriculum)
    if (!plan || !selectedLearner) return
    createAssignment({ learnerId: selectedLearner.id, title: plan.title, description: plan.objective, points: 10 })
    renderParentDashboard(selectedLearner.id, stage, subject)
  }))
  document.querySelectorAll<HTMLButtonElement>("[data-use-reference]").forEach(button => button.addEventListener("click", () => {
    const lesson = stageLessons.find(item => item.id === button.dataset.useReference)
    if (!lesson || !selectedLearner) return
    addCurriculumPlan({ learnerId: selectedLearner.id, stage, subject: lesson.subject, title: lesson.title, objective: lesson.objective, cadence: "Parent-defined cadence", resources: lesson.materials })
    renderParentDashboard(selectedLearner.id, stage, subject)
  }))
  document.getElementById("state-overview-form")!.addEventListener("submit", event => {
    event.preventDefault()
    const saved = saveStateRequirementOverview({ state: (document.getElementById("state-name") as HTMLInputElement).value, officialSourceUrl: (document.getElementById("state-source-url") as HTMLInputElement).value, notes: (document.getElementById("state-notes") as HTMLTextAreaElement).value })
    if (saved) renderParentDashboard(selectedLearner?.id, stage, subject)
    else document.getElementById("state-overview-error")!.textContent = "Use a complete http:// or https:// URL, or leave the source field empty."
  })
  document.querySelectorAll<HTMLInputElement>("[data-state-requirement]").forEach(input => input.addEventListener("change", () => toggleStateRequirementPrompt(input.dataset.stateRequirement!, input.checked)))
  document.getElementById("add-spirit-content")!.addEventListener("submit", event => {
    event.preventDefault()
    const audience = (document.getElementById("spirit-audience") as HTMLSelectElement).value
    const added = addSpiritContent({ kind: (document.getElementById("spirit-kind") as HTMLSelectElement).value as SpiritContentKind, title: (document.getElementById("spirit-title") as HTMLInputElement).value, tradition: (document.getElementById("spirit-tradition") as HTMLInputElement).value, description: (document.getElementById("spirit-description") as HTMLTextAreaElement).value, guidingQuestion: (document.getElementById("spirit-question") as HTMLTextAreaElement).value, targetLearnerIds: audience ? [audience] : [], sourceUrl: (document.getElementById("spirit-source-url") as HTMLInputElement).value })
    if (added) renderParentDashboard(selectedLearner?.id, stage, subject)
    else document.getElementById("spirit-content-error")!.textContent = "Add a title and description. Source URLs must begin with http:// or https://."
  })
  document.querySelectorAll<HTMLButtonElement>("[data-remove-spirit]").forEach(button => button.addEventListener("click", () => { removeSpiritContent(button.dataset.removeSpirit!); renderParentDashboard(selectedLearner?.id, stage, subject) }))
}
