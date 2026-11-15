import { absoluteUrl, identity, longBio, sameAs, SITE_URL } from "@/lib/identity";
import type { Project } from "@/types";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type JsonLdNode = Record<string, unknown>;

const personRef = { "@id": PERSON_ID };

export function personNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: identity.name,
    alternateName: identity.alternateNames,
    givenName: identity.givenName,
    familyName: identity.familyName,
    jobTitle: identity.jobTitles,
    description: longBio,
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    nationality: { "@type": "Country", name: "Philippines" },
    address: {
      "@type": "PostalAddress",
      addressLocality: identity.location.locality,
      addressCountry: identity.location.country,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: identity.education.school,
      url: identity.education.url,
    },
    hasCredential: identity.credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      name: credential.name,
      credentialCategory: "certificate",
      dateCreated: credential.issued,
      recognizedBy: {
        "@type": "Organization",
        name: credential.issuer,
        url: credential.issuerUrl,
      },
    })),
    award: identity.awards,
    knowsAbout: identity.knowsAbout,
    memberOf: identity.community.map((group) => ({
      "@type": "Organization",
      name: group.name,
    })),
    sameAs,
  };
}

function organizationNodes(): JsonLdNode[] {
  return identity.ventures.map((venture) => ({
    "@type": "Organization",
    "@id": `${SITE_URL}/#org-${venture.id}`,
    name: venture.name,
    description: venture.description,
    ...("url" in venture ? { url: venture.url } : {}),
    founder: personRef,
  }));
}

/** Site-wide graph: Person, WebSite and the organizations he co-founded. */
export function siteGraph(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: identity.name,
        description: identity.metaDescription,
        inLanguage: "en",
        publisher: personRef,
        author: personRef,
      },
      ...organizationNodes(),
    ],
  };
}

export function profilePageGraph(faq: ReadonlyArray<{ q: string; a: string }>): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${identity.name} | ${identity.role}`,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: personRef,
        about: personRef,
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

function breadcrumb(items: Array<{ name: string; path: string }>): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectsIndexGraph(projects: Project[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: `Projects by ${identity.name}`,
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(`/projects/${project.slug}`),
          name: project.title,
        })),
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ],
  };
}

export function projectGraph(project: Project): JsonLdNode {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const node: JsonLdNode = {
    "@type": project.githubUrl ? "SoftwareSourceCode" : "SoftwareApplication",
    "@id": `${url}#project`,
    name: project.title,
    description: project.longDescription || project.description,
    url,
    author: personRef,
    creator: personRef,
    keywords: project.tags.join(", "),
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    ...(/^\d{4}$/.test(project.year) ? { dateCreated: project.year } : {}),
    ...(project.image ? { image: project.image } : {}),
  };

  if (!project.githubUrl) {
    node.applicationCategory = "WebApplication";
    node.operatingSystem = "Web";
  } else {
    const languages = project.tags.filter((tag) =>
      /^(TypeScript|JavaScript|Python|Java|Rust|Lua|PHP|SQL|Solidity)$/i.test(tag),
    );
    if (languages.length) node.programmingLanguage = languages;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      node,
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
    ],
  };
}

export function JsonLdScript({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so CMS text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
