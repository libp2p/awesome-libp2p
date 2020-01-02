# Awesome Libp2p

A catalog of libp2p awesomeness from the community to the community.

This catalog is for projects, protocol implementations, or pretty much anything related to `libp2p` that are totally awesome. If you have plans for awesome stuff to do with libp2p, you should build it and then link it here. If you have an idea for an awesome thing to do with libp2p, a good place to ask about it might be in [discourse](https://discuss.libp2p.io/).

## Lead Maintainer

[Vasco Santos](https://github.com/vasco-santos)

## Table of Contents

TODO

## Objectives

- Catalog libp2p useful content
- Enable the community to share knowledge and resources, moving libp2p forward

## Content categories

All the content should be associated with a category and contain a set of labels.

### Applications

This section should reference all the awesome applications being built on top of libp2p. 

- ...

### Protocols

The protocols section aims to reference all the relevant protocols that libp2p users might be interested in using on their projects.

- ...

### Examples

The examples section contains a list of code samples using any implementation of libp2p. This list can include references to other github repositories or codesandbox projects (for the web).

- ...

### Articles

The articles section contains all the relevant articles and blog posts around libp2p. This content should be structured by its implementation and complexity.

- ...

### Videos

The videos section should reference the most active youtube channels, as well as learning videos and recordings of presentations.

- ...

### Presentations

The presentations section should reference the most relevant presentations regarding libp2p. These presentation should be structured by project/implementations, as well as according to their complexity and relevant libp2p versions.

- ...

## Labels

- Implementation
- Environment
- Semver ranges?
- Complexity

## Main references

- https://awesome.ipfs.io/
  - https://github.com/ipfs/awesome-ipfs


## Requirements

- Differentiate implementation content
- Differentiate between versions
- Contribution guidelines

---


## Challenges/Questions/doubts

- Visual structure in github? 
  - Use https://github.com/ipfs/awesome-ipfs as a base does not seem a good idea. With several implementations, things will get confusing
- Should we have a website similarly to ipfs (https://awesome.ipfs.io/)?
  - I think we should have, only adding a top filter for implementation and versions
- Should we have the code for examples in the repo or reference other repos?
  - I am in favour of reference:
    - I think that referencing is more interesting for the community, where their point their own repos and maintain the work that they care about
    - Taking into account that we will have multiple implementations, the maintenance and review process will be complex and time consuming
    - The maintainers will need to guarantee that the examples work properly maintainers.
    - Even with a reference, we can create docs to integrate the examples within libp2p upstreams for CI purposes. This makes 
- Best way to track versioning?
  - This gets more complex for articles, presentations, ...
- Contribution guidelines
  - Depends on previous decisions
