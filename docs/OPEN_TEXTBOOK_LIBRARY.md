# Open Textbook Library Registry

This registry is a discovery and attribution layer for Learning World OS. It does **not** copy or redistribute books. Each linked provider hosts its own work, retains its stated license, and may revise individual titles. Before bundling any text, image, or PDF in the app, record the exact book-level license and attribution below.

## Approved discovery collections

| Collection | Scale | Suitable subjects | License policy | Catalog / API |
| --- | ---: | --- | --- | --- |
| Open Textbook Library (Open Education Network) | 1,760+ textbooks | All higher-ed subjects | Each title has its own open license; no CC-ND titles accepted | https://open.umn.edu/opentextbooks/ · https://open.umn.edu/opentextbooks/textbooks.json |
| OpenStax | Dozens of peer-reviewed texts | Math, science, social science, business, humanities, CS | CC BY-NC-SA 4.0 for current textbooks | https://openstax.org/subjects |
| LibreTexts | Large multi-discipline library | STEM, humanities, social sciences | License varies by page/book; record the displayed license | https://libretexts.org |
| BCcampus / Pressbooks | Large OER catalog | Higher education and professional topics | License varies by title; many CC licenses | https://pressbooks.bccampus.ca/catalog/ |
| Wikibooks | Community-maintained textbooks | Computing, languages, humanities, reference | CC BY-SA 4.0 + GFDL unless noted | https://en.wikibooks.org/wiki/Main_Page |

## Initial subject shelf

These are high-quality, directly relevant starting shelves. They deliberately link to authoritative collection pages so the catalog stays current without redistributing third-party content.

### Mathematics

- Algebra 1, Elementary Algebra 2e, Intermediate Algebra 2e, Prealgebra 2e
- Contemporary Mathematics, Precalculus 2e, Introductory Statistics 2e
- Introductory Business Statistics 2e, Principles of Data Science
- Calculus Volumes 1–3

Source: https://openstax.org/subjects/math/

### Science and engineering

- Anatomy and Physiology 2e, Astronomy 2e, Biology 2e, Biology for AP® Courses
- Concepts of Biology, Microbiology, Introduction to Behavioral Neuroscience
- Chemistry 2e, Chemistry: Atoms First 2e, Organic Chemistry: A Tenth Edition
- College Physics 2e, College Physics for AP® Courses 2e, Physics
- University Physics Volumes 1–3, Additive Manufacturing Essentials

Source: https://openstax.org/subjects/science

### Computing, business, and social science

- Foundations of Computer Science, Introduction to Computer Science, Principles of Data Science
- Information Systems, Python Programming
- Accounting and Finance, Business Law and Ethics, Economics, Management and Marketing
- American Government, Anthropology, Lifespan Development, Psychology, Sociology

Source: https://openstax.org/subjects

### Broader collections for future curation

- Open Textbook Library subject records: https://open.umn.edu/opentextbooks/subjects.json
- Open Textbook Library machine-readable title records: https://open.umn.edu/opentextbooks/textbooks.json
- Open Textbook Library API documentation: https://open.umn.edu/opentextbooks/api-docs/index.html
- BCcampus OER discipline directory: https://pressbooks.bccampus.ca/vccoerdiscipline/
- Wikibooks textbook catalog: https://en.wikibooks.org/wiki/Category:Textbooks

## Intake checklist

1. Save the title, author/editor, publisher, canonical URL, format URL, and retrieval date.
2. Record the exact license shown on the title page—not only the collection’s general policy.
3. Reject all-rights-reserved works and CC-ND works; obtain permission for any exception.
4. Preserve required attribution, license links, and change notices in the app’s `CITATION_LOG.md`.
5. Review age suitability, accessibility, factual currency, and image-level licensing.
6. Store a checksum and source version for every bundled file.

## Offline packaging policy

The installed app may bundle only reviewed books whose individual license permits the intended use. Keep each item in a separate content package with its attribution file; never apply DRM or restrict rights that the original license grants.
