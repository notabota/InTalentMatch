# Contributing

Quick guide for the team. Read once and we're on the same page.

## Branching

`main` is what runs. Every piece of work starts on a short-lived branch off main and goes back in through a PR.

Branch names:

- `feat/<scope>` for new features
- `fix/<scope>` for bug fixes
- `chore/<scope>` for tooling, deps, infra
- `docs/<scope>` for docs only
- `refactor/<scope>` for moves and renames with no behavior change

Keep them short. Open a PR within a day or two of starting.

## Commits

Conventional Commits, lowercase, imperative.

```
<type>(<scope>): <short summary>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`.

Scopes by area: `ui`, `layout`, `auth`, `browse`, `post`, `my-postings`, `my-jobs`, `profile`, `payment`, `subscription`, `chat`, `landing`, `api`, `db`, `infra`, `design`, `seed`.

Examples:

```
feat(ui): add Button primitive with variants and pill option
fix(api): handle case-sensitive query params after Next migration
chore(infra): add CODEOWNERS and PR template
```

Sign every commit with `-s` so we have DCO.

```
git commit -s -m "feat(ui): add Button primitive"
```

## Pull requests

- Open one even for small changes. The PR is the conversation.
- Title matches the Conventional Commit format.
- Link the issue in the body: `Closes #N`.
- At least one approval before merge.
- CI must be green.
- Squash-merge into main. Keeps the log clean.

## Code

- TypeScript everywhere.
- Absolute imports via the `@/` alias.
- Shared components live in `src/components/*`. Page-local components live next to the page.
- No `console.log` in committed code.

## Local

```
npm i
cp .env.example .env  # fill DATABASE_URL etc
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

## Tests

- Unit tests next to the code or under `tests/unit/`.
- E2E under `tests/e2e/`.

```
npm test
npm run test:e2e
```
