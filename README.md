# Personal diverging fork of watsuyo/notion-rss-reader

This is a diverging fork of watsuyo/notion-rss-reader. Usage is the same as the parent, but functionality may differ.

No support is provided on this fork.

Notable changes from upstream:

- Warnings in GHA CI
- Properly reports HTTP errors
- Instead of only grabbing results from the last hour, grab them from the last 24 hours and ensure there are no duplicates by just checking if the URL was already recorded in the db.