# K–12 course-material retrieval system

## Purpose and boundary

The United States has no single mandatory national K–12 curriculum. This system uses widely recognized national **standards frameworks** as the learning-target layer, then requires a jurisdictional check and a licensed-material retrieval record before content is added to a LearnOS semester module. Standards identify intended learning; they are not a complete curriculum or permission to copy instructional materials.

## Required path for every semester module

1. **Set jurisdiction:** record the learner's state, district/umbrella-school requirements, graduation requirements (for grades 9–12), and any family requirements. Retrieve the adopted standards from that authority's official education site. This is the controlling alignment source.
2. **Choose the national anchor:** use the subject row in the source map below. Record framework edition, retrieval date, grade/grade-band, standard IDs, and any state adaptation.
3. **Build the semester spine:** select 4–6 units, sequence prerequisite skills, and allocate each unit to a calendar window. Preserve the framework's grade band when it is not grade-specific (for example NGSS 6–8).
4. **Retrieve candidate materials:** follow the listed material route in order: publisher/organization directly, then its official free-resource library, then an approved OER repository. Never scrape, upload, or redistribute a publisher's content without permission.
5. **Screen each item:** check grade fit, standard evidence, accessibility, cultural accuracy, safety, cost, copyright/license, and whether it can be used offline. Add a stable URL and retrieval date.
6. **Create learning evidence:** each unit needs a performance/product, a short formative check, and a standard-to-evidence mapping. Use a rubric or success criteria, not only completion.
7. **Publish safely:** replace all `TODO` text in the semester manifest; add only URLs allowed by the family's Parent Source Policy; retain the completed source-map record beside the manifest.
8. **Review annually:** re-check authoritative links, standards updates, licenses, and state requirements before reuse. Do not silently overwrite a released module; create a new version.

## Semester outline hierarchy

```text
K–12 source system
└── Grade / subject / semester module
    ├── Jurisdiction record (state + local requirements)
    ├── National-framework record (framework, edition, standard IDs)
    ├── 4–6 unit records
    │   ├── essential question and outcome
    │   ├── standards / practices / evidence statement
    │   ├── learning sequence and assessment evidence
    │   └── approved-material records (URL, license, access date, notes)
    └── module manifest (learner-facing assignment record)
```

## National-framework and material-source map

| LearnOS subject | National anchor and exact standards path | Course-material retrieval route | K–12 sequencing rule |
|---|---|---|---|
| Early Learning | [Head Start ELOF](https://headstart.gov/school-readiness/effective-practice-guides/effective-practice-guides) (birth–5; use only for kindergarten transition/readiness) | Start with ELOF guides; combine with the controlling state kindergarten standards and local, play-based materials. | Do not treat preschool domains as a K–12 subject sequence; bridge to K standards. |
| Music | [National Core Arts Standards—Music](https://www.nationalartsstandards.org/content/national-core-arts-standards) | Use the standards site’s music handbook/resources; then vetted public-domain repertoire and locally licensed methods. | K–8 uses grade performance standards; high school uses Proficient/Accomplished/Advanced pathways. |
| Beginner Coding | [CSTA PK–12 Standards](https://csteachers.org/k12standards/) plus [ISTE Student Standards](https://iste.org/standards/students) | Start with CSTA grade-band concepts/practices; retrieve full lessons from [Code.org](https://code.org/educate/curriculum) and document the curriculum license/terms. | Use CSTA bands: K–2, 3–5, 6–8, 9–10, 11–12; attach ISTE digital-citizenship evidence. |
| Mathematics | [Common Core Mathematics](https://corestandards.org/mathematics-standards/) | Retrieve adopted-state crosswalk first; then use [Illustrative Mathematics](https://illustrativemathematics.org/) and [OpenStax](https://openstax.org/subjects/math) where their licenses/grade fit are confirmed. | K–8 is grade-specific; 9–12 is course-path based, so identify Algebra/Geometry/Integrated pathway before planning. |
| Reading | [Common Core ELA/Literacy](https://corestandards.org/english-language-arts-standards/) | Retrieve standards under Reading plus the local reading-list policy; use public-domain or properly licensed texts and [Library of Congress](https://www.loc.gov/classroom-materials/) primary sources. | Build text complexity and knowledge coherently; grades 6–12 use discipline literacy as a supplement, not a replacement. |
| Science | [NGSS standards search/download](https://www.nextgenscience.org/standards) | Retrieve performance expectations, evidence statements, and appendices; then locate aligned units at [OpenSciEd](https://openscied.org/) and verify the unit's stated license/grade. | Plan three-dimensional units: performance expectation + practice + core idea + crosscutting concept; K–5 grade-specific, 6–12 course mapping. |
| History | [C3 Framework](https://www.socialstudies.org/standards/c3) | Start with C3 inquiry dimensions and state history standards; retrieve primary sources from [Library of Congress](https://www.loc.gov/classroom-materials/) and [National Archives DocsTeach](https://www.docsteach.org/). | Organize around compelling questions, disciplinary concepts, evidence, and civic communication/action. |
| Geography | [C3 Framework](https://www.socialstudies.org/standards/c3) (geography dimension) | Retrieve state geography standards, then C3 geography indicators and datasets/maps from [National Geographic Education](https://education.nationalgeographic.org/) subject to its terms. | Spiral spatial thinking, human-environment interaction, and regional/global scale from K–12. |
| Language Arts | [Common Core ELA/Literacy](https://corestandards.org/english-language-arts-standards/) | Retrieve the grade's Reading, Writing, Speaking/Listening, and Language strands; use licensed texts and [ReadWriteThink](https://www.readwritethink.org/) materials after checking terms. | Create one integrated semester spine across all four strands; keep grades 9–12 course titles in the local record. |
| Art & Creativity | [National Core Arts Standards—Visual Arts / Media Arts](https://www.nationalartsstandards.org/content/national-core-arts-standards) | Retrieve discipline, grade/performance level, artistic process, and model assessment; use museum open-access collections only under each collection's stated rights. | Use Creating, Presenting/Producing, Responding, and Connecting; select high-school proficiency level before planning. |
| Physical Education | [SHAPE America National PE Standards](https://apeas.shapeamerica.org/APEAS3/standards/pe/new-pe-standards.aspx) | Retrieve standards and grade-span learning indicators, then use the linked SHAPE resources or locally licensed programs. | Map each grade to SHAPE spans PreK–2, 3–5, 6–8, 9–12; adapt activity/safety for learner needs. |
| Engineering | [NGSS engineering design](https://www.nextgenscience.org/standards) and [NGSS Appendix I](https://www.nextgenscience.org/resources/appendix-i-engineering-design-ngss) | Retrieve ETS performance expectations and Appendix I, then use [TeachEngineering](https://www.teachengineering.org/) lessons with its stated licenses. | Treat engineering as iterative design: define problem, develop/test solution, optimize; pair grade-band math/science prerequisites. |
| Living Library | [AASL National School Library Standards](https://standards.aasl.org/framework/) | Retrieve the learner framework and crosswalks; use the library's catalog, public-library databases, and rights-cleared digital collections. | Map projects to Inquire, Include, Collaborate, Curate, Explore, and Engage—not a fixed reading list. |
| Homestead Lab | [National Standards for Family and Consumer Sciences](https://www.nasafacs.org/national-standards-overview.html) where applicable | Retrieve the relevant FCS career-ready practice/content-area standard; pair with official safety guidance from [USDA](https://www.usda.gov/) or [CDC](https://www.cdc.gov/) for food, home, and care topics. | Sequence safety and supervised practice first; do not present local household methods as universal standards. |
| Learning Commons | [AASL learner framework](https://standards.aasl.org/framework/) and [ISTE Students](https://iste.org/standards/students) | Retrieve AASL shared foundations/crosswalks and ISTE indicators; source research tools via the public/school library. | Use cross-curricular inquiry projects; document source evaluation, citation, privacy, and collaboration evidence. |
| Gardening | [NAAEE Guidelines for Excellence](https://naaee.org/eepro/resources/guidelines-excellence) plus relevant [NGSS](https://www.nextgenscience.org/standards) | Retrieve NAAEE learner guidelines and targeted NGSS PEs; obtain practical materials from [USDA Farm to School](https://www.fns.usda.gov/f2s) and local extension services. | Build seasonal local investigations; align biology/ecology/earth systems to NGSS rather than treating gardening as a standalone national-course sequence. |
| Mindful Movement | No single nationally adopted K–12 academic standard; use [CASEL framework](https://casel.org/fundamentals-of-sel/), SHAPE PE, and local wellness requirements as complementary guides. | Retrieve evidence-informed, non-clinical activities from the approved wellness provider; use SHAPE for movement outcomes. | Keep participation optional and trauma-informed; no diagnosis, therapy, or health claim. |
| Spirit | No national secular K–12 curriculum framework should govern faith/spiritual formation. | Use a family/organization-owned scope and sequence, vetted by its authorized leader; record source, tradition, and permissions separately. | Keep it optional, family-directed, non-coercive, and clearly separate from academic compliance records. |

## Material-record fields

Store one record per unit material in the unit's source map. The existing module importer only reads basic manifest fields, so this record is deliberately kept as a companion file until the app adds standards metadata.

```json
{
  "materialId": "grade-01-language-arts-semester-01-u01-text-01",
  "title": "",
  "provider": "",
  "url": "https://",
  "retrievedOn": "YYYY-MM-DD",
  "materialType": "lesson | text | primary-source | dataset | assessment | teacher-guide",
  "licenseOrTermsUrl": "https://",
  "cost": "free | paid | library-access | family-owned",
  "gradeOrBand": "",
  "standards": ["STATE.CODE", "NATIONAL.CODE"],
  "unit": "u01",
  "accessibilityNotes": "",
  "reviewStatus": "candidate | approved | retired",
  "reviewedBy": "",
  "notes": ""
}
```

## Minimum unit outline

```markdown
# U01 — [Title]

- **Semester module:** `grade-01-language-arts-semester-01`
- **Jurisdictional standards:** [IDs and official URL]
- **National anchor:** [framework, IDs, edition]
- **Essential question:**
- **Student outcome / evidence:**
- **Sequence:** launch → investigate/practice → create/perform → reflect/revise
- **Assessment:** formative check; performance/product; rubric/success criteria
- **Materials:** links to completed material-record files
- **Accessibility/safety:**
- **Parent-source policy check:**
```
