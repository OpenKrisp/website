# Website language and tone

Translate the visitor’s intent, then read each page as a whole. Headlines may use
different wording and sentence structure in each language. A sentence can be
grammatically correct and still sound like a translation.

Write the privacy headline as original copy in each language. Avoid turning the
idea of privacy built into the product into a vague time reference such as
“desde el principio.” The headline should express the visitor’s benefit in
familiar language. In the preview footer, state the concrete fact that noise
reduction runs on the visitor’s device instead of repeating a privacy slogan.

| Language | Voice and terminology |
| --- | --- |
| English | Conversational, concise product English. Explain audio routing with familiar words before using technical labels. |
| Spanish | Broadly understood Spanish with **tú**. Use **equipo** for the computer in prose; keep the desktop app’s **micrófono**, **auriculares**, **altavoces**, and **reducción de ruido**. |
| Brazilian Portuguese | Brazilian phrasing with **você**, **seu**, **aplicativo**, **fones de ouvido**, and **alto-falantes**. Avoid European Portuguese vocabulary and literal English slogans. |
| French | Use **vous** consistently. Prefer **le son**, **son reçu**, and **vos interlocuteurs** in prose; retain the app’s **microphone**, **haut-parleurs**, and **réduction du bruit**. Use nonbreaking spaces before double punctuation. |
| German | Use **du** consistently. Prefer natural German sentence order and **Ton** or **Audiodaten** where English uses “audio.” Keep **Rauschunterdrückung** as the app’s control terminology. |

## Meaning that must survive editing

- The two audio paths are the microphone signal and the audio received from other
  participants **during a call**. They are not outgoing calls versus incoming
  calls. Each path’s noise reduction can be enabled independently.
- Enabling noise reduction does not mean switching on the physical microphone or
  speakers. Instructions should name the processing when this could be ambiguous.
- OpenKrisp processes audio locally for noise reduction. The call app still
  connects and transmits the conversation. Do not turn that into a claim that
  audio never leaves the computer.
- Preserve **OpenKrisp**, **OpenKrisp Microphone**, **OpenKrisp Speaker**, platform
  names, package formats, release versions, license scope, and beta limitations.
- Keep named slots intact and in grammatically appropriate positions. Review the
  complete rendered sentence, including linked words and emphasized device names.
- Review metadata, accessible descriptions, dynamic states, dialogs, and expanded
  disclosures as carefully as headlines and visible paragraphs.

## Platform terminology

The installation note uses Apple’s localized terminology for notarization:

- Spanish: **certificada ante notario**. [Apple Support in Spanish](https://support.apple.com/es-es/102445)
- Brazilian Portuguese: **autenticada pela Apple**. [Apple Support in Brazilian Portuguese](https://support.apple.com/pt-br/102445)
- French: **authentifiée par Apple**. [Apple Support in French](https://support.apple.com/fr-fr/102445)
- German: **von Apple beglaubigt**. [Apple Support in German](https://support.apple.com/de-de/102445)

Signing and notarization are separate statements; do not imply that all developer
signatures are issued by Apple itself.

## Review and validation

For copy changes, read the whole catalog in context, compare meaning with English,
and check register, idiom, terminology, grammar around slots, and regional usage.
Then run the repository checks and inspect every language on desktop and mobile,
including expanded content and longer labels.

Automated tests verify catalog coverage, placeholders, rendering, language
selection, and URLs. They do not establish fluency or idiomatic quality. The
current copy has had a separate AI reviewer for each language, followed by an
integration review. See the [independent review record](independent-language-review.md)
for scope and findings. Human native-speaker editorial sign-off has not been
recorded. Record future native-editor feedback with the language, affected keys,
and rationale.
