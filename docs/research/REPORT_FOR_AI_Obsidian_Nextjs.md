# Technical Report: Decoupling Content from Code in a Next.js Portfolio using Obsidian

## 1. Problem Statement

The current Next.js portfolio project co-locates application source code with sensitive, personal content (resume, project details) stored in Markdown and JSON files within a single GitHub repository. This creates a critical conflict: making the repository public to showcase technical skills would unintentionally expose private personal data.

**Objective:** Achieve a clear separation of concerns, enabling the source code to be public while keeping the content private.

## 2. Proposed Solution: Obsidian as a Local Headless CMS

We propose an architecture that leverages Obsidian as a local, Git-based headless CMS, effectively decoupling the content from the application code.

### Architectural Overview

1.  **Repository Separation**:
    *   **Code Repository (Public)**: Will contain only the Next.js application source code. All content files containing personal information will be removed.
    *   **Content Repository (Private)**: Will store all Markdown/JSON content files. This repository will be managed using Obsidian and set to "Private" on GitHub.

2.  **CI/CD-based Content Integration**:
    *   **Build Process**: A GitHub Actions workflow will be implemented. During the build, it will check out both the public code repository and the private content repository.
    *   **Deployment**: The build server will combine the code and content, generate the static site, and deploy the final artifact to a hosting service like Vercel. This ensures that the private content is only accessed in the secure build environment.

## 3. Technical Feasibility Analysis

A review of potential technical challenges and their solutions was conducted.

| Challenge | Description | Solution & Assessment |
| :--- | :--- | :--- |
| **CI/CD Complexity** | Requires a custom GitHub Actions workflow instead of a standard "connect-and-deploy" setup. | This is a standard pattern. Using `actions/checkout` twice with a Personal Access Token (`secrets`) is well-documented. **Low hurdle.** |
| **Local Dev Setup** | Developers must clone two repositories instead of one. | This process can be clearly documented in the `README.md`. **Negligible issue.** |
| **Obsidian-Specific Syntax** | Obsidian's `[[WikiLinks]]` are not standard Markdown and require parsing. | This is a solved problem. Libraries like `remark-wiki-link` can be integrated into the Markdown processing pipeline to convert WikiLinks to standard HTML `<a>` tags. **Easily solvable.** |
| **Build Time Impact** | Cloning the content repository adds a small overhead to the build time. | The content, being primarily text, is lightweight. The impact on build duration is expected to be minimal and **can be considered negligible.** |

## 4. Conclusion

The proposed architecture is a robust and secure solution that aligns with industry best practices. All identified technical challenges are readily addressable with existing tools and established patterns. This approach will successfully meet the primary objective of maintaining a public codebase while ensuring the privacy of personal content.
