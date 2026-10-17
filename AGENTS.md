<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use the root route for the shared BAMBINO header and footer; leaf routes own their page metadata so every destination is independently shareable.
- Keep shared play-zone content and page elements in src/components/bambino.tsx so activities and ages remain consistent across pages.
- Define visual styles and semantic palette in src/styles.css so all pages follow one design system.

- AI event helper: facts live in src/lib/ai/event-facts.ts and the model call in a server route (/api/event-chat); update the facts whenever event details change so answers stay accurate.
- Keep event programme timing and draft status in src/lib/event-programme.ts, shared by the event page and AI facts; zone identity and setup imagery remain in the shared BAMBINO module to prevent drift.
