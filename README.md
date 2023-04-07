# The Symthink Project

![alt hands puzzle gankyil overlay](https://github.com/symthink/monorepo/blob/main/hands-puzzle-gankyil-overlay.png?raw=true)

[https://symthink.org](https://symthink.org)

## TLDR; Get Started

First, install [https://firebase.google.com/docs/emulator-suite/install_and_configure](Firebase local emulators) for: Authentication, Firestore and Functions. Contact the repo owner to ensure you have access to the submodules you need.  Then...

```sh
git clone https://github.com/symthink/monorepo.git
cd monorepo
git submodule update --init --recursive
npm run emulate
npm install --legacy-peer-deps
npm run start:news
```

---

## What is it?

This monorepo is used for building an open document format called "symthink". The document format is a heirarchy of questions, claims and ideas, each no more than 250 characters. It is intended to incentivize integrity indirectly by using metrics measuring mindset, sources and depth. It will eventually have an an interactive component and integrate with social & fundraising platforms.

## Why it matters

> We’re living through the consequences of 20 years of centralised, corporate-controlled social media, with a small oligopoly of large tech firms tightening their grip on the public square,
> 
> In private hands, our choice is limited, toxicity is rewarded, rage is called engagement, public trust is corroded, and basic human decency is often an afterthought.
> - Steve Teixeira, chief product officer at Mozilla quoted in [The Guardian](https://www.theguardian.com/technology/2022/dec/21/firefox-and-tumblr-join-rush-to-support-mastodon-social-network)

The problem so aptly described by Steve Teixeira has also resulted in such intense political polarization it has blocked legislative progress on several important issues, including the ability to impose any sort of regulation on Big Tech.  Social media toxicity, rage and corroded public trust will continue to deteriorate unless individual developers and designers take the initiative to work on some of the hard technical problems facing democracies and their relationship to social media. For example:

- Decentralized social networking protocols (e.g. ActivityPub).
- Fair & open source algorithms for metrics used to promote/supress user content.
- Open source UI web components that support collective understanding and decision making.

This project targets the latter two.

## Tech Stack & Status

The directory scaffolding is generated by [Nx](https://nx.dev/) to make it easier to share and develop the standard HTML web components in conjunction with other apps and javascript frameworks. So, apps go under the `/apps` directory and web components under `/libs/i2d`. They share a `package.json` at the root level.

**Status**: There is currently just one app in this repo, `/apps/doc`, which is the viewer application for symthink documents. There is an `/apps/editor` app for the documents which is built on the same stack but in a private sub-repo currently because it's tied to branding and a backend service.

**Document viewer**: is a single page web app using standard html web components built with Ionic's [Stencil](https://stenciljs.com/) toolchain. The app itself is a very thin layer. The majority of the code is in the `/libs/i2d` web component lib because those are shared with the Editor app.

- **Editor**: [editor.symthink.org](https://editor.symthink.org)
- **Viewer demo**: [A Symthink of Thrive Montgomery 2050](https://symthink.io/n/c1gGiB48OeO6Btd8QuoZ)

## Help build it

> All contributions to this project will be released under the CC0 public domain dedication. By submitting a pull request or filing a bug, issue, or feature request, you are agreeing to comply with this waiver of copyright interest. Details can be found in our [TERMS](TERMS.md) and [LICENSE](LICENSE).

There are two primary ways to help:

1. Using the issue tracker, and
2. Changing the code-base.

**Using the issue tracker**: suggest feature requests, report bugs, and ask questions. This is also a great way to connect with the developers of the project as well as others who are interested in tackling this problem domain. Use the issue tracker to find ways to contribute. Find a bug or a feature, mention in the issue that you will take on that effort, then follow the _Changing the code-base_ guidance below.

**Changing the code-base**: Generally speaking, you should fork this repository, make changes in your own fork, and then submit a pull request. The code should follow any stylistic and architectural patterns in the existing code-base.  If you have never submitted a PR to an open source project, this is a helpful [How To](https://opensource.com/article/19/7/create-pull-request-github).

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

---

## Open source licensing info

1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


