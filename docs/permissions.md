# Permissions

| Actor | Read synthetic cases | Filter/select | Copy mock JSON | Execute financial action |
|---|---:|---:|---:|---:|
| Anonymous visitor | Yes | Yes | Yes | No |

There are no accounts or privileged roles. Clipboard access occurs only after an explicit click. Every policy-sensitive payload is a staged handoff with `auto_execute:false`; the product cannot contact or mutate a financial system.
