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

# Project rules

- Editable site texts live as key/value rows in `site_content`; add new editable text by adding a key (and to the `SiteContent` type), not new columns. Why: one generic admin form edits all texts.
- Admin access is `has_role(uid,'admin')` from `user_roles`; the first account ever registered becomes admin via trigger. Why: single-admin requirement without hardcoded credentials.
- Uploaded images go to the private `media` bucket and are stored as long-lived signed URLs, because public buckets are blocked in this workspace.
