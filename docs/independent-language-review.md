# Independent language review

Five separate AI subagents reviewed the website catalogs against commit
`5e513f28ad4be65a9917790c4de2a67057ac5733`. Each reviewer owned one language,
read all 130 messages against the same frozen English reference, and used the
page template, slot renderer, and language guide for context. Each supplied
before/after text and a rationale for every change. The integration review
checked those reports against the resulting catalogs.

| Language | Messages reviewed | Messages revised | Main findings |
| --- | ---: | ---: | --- |
| English | 130 | 14 | Clarify call-app setup, received audio, local processing, and independent noise-reduction controls. Preserve the exact virtual microphone name. |
| Spanish | 130 | 17 | Use `equipo` consistently; improve setup help, compatibility phrasing, processing controls, and GPL redistribution prose. |
| Brazilian Portuguese | 130 | 13 | Standardize `aplicativo` and `fones de ouvido`; improve setup help, metadata, independent controls, and GPL recipient/source wording. |
| French | 130 | 14 | Improve audio-path phrasing, `son reçu`, output-level labeling, independent processing controls, and GPL prose. |
| German | 130 | 29 | Replace literal audio terminology, clarify setup actions, use natural status/control labels, and improve GPL prose. Preserve the unconfirmed speakerphone limitation and exact device name. |
| **Total** | **650** | **87** | |

The visible preview buttons now name noise reduction in every language. This
avoids implying that they quit the app or switch off audio hardware. Other changes
retain regional voice, linked-sentence grammar, brand names, release information,
beta limitations, and the scope of the license and local-processing statements.
No reviewer reported an unresolved wording concern.

Integration validation checks complete key coverage, nonempty values, unchanged
named slots and numeric facts, exact device/license identifiers, and agreement
between the review reports and catalog diffs. The repository's syntax checks,
localization/behavior tests, and production build provide technical validation.
Visual review covers all five languages at desktop and mobile sizes, expanded
content, help dialogs, and both preview-button states, with additional checks at
320px for long labels.

The 320px review found that the preview window title could split the brand across
lines. The title now stays together, and compact audio-flow descriptions use the
document language for automatic hyphenation. Final visual checks found no
horizontal overflow or clipped text at 1440px, 390px, or 320px. Both button states
and help dialogs were checked in every language.

These are independent AI editorial reviews. They are not human native-speaker
sign-off, and automated or visual checks do not establish perfect fluency. Future
human-editor feedback should record the language, affected keys, and rationale.
