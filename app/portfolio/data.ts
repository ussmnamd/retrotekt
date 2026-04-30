export interface Project {
  slug: string;
  name: string;
  type: string;
  tags: string[];
  location: string;
  description: string;
  coverImage: string;
  images: string[];
  filterCategory: "Interior" | "Exterior" | "Aerial" | "Full Project";
  layout: "featured" | "tall" | "equal";
}

export const projects: Project[] = [
  {
    slug: "harlow-residence",
    name: "The Harlow Residence",
    type: "Full Project",
    tags: ["Exterior", "Interior"],
    location: "Austin, TX",
    description:
      "A complete pre-construction visualization package for a high-end residential build in Austin. Deliverables included exterior beauty shots, interior lifestyle renders, and a full walkthrough animation for the client presentation. The Harlow project set the benchmark for our residential full-project offering.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
    ],
    filterCategory: "Full Project",
    layout: "featured",
  },
  {
    slug: "azure-hospitality-suite",
    name: "Azure Hospitality Suite",
    type: "Interior",
    tags: ["Hospitality"],
    location: "Miami, FL",
    description:
      "A luxury hospitality interior visualization for a boutique hotel suite concept in Miami. Our team produced photorealistic renders that captured the warmth and texture of the design before a single piece of furniture was ordered. Used directly in investor and booking platform materials.",
    coverImage:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=1200&q=80",
    ],
    filterCategory: "Interior",
    layout: "tall",
  },
  {
    slug: "meridian-mixed-use-tower",
    name: "Meridian Mixed-Use Tower",
    type: "Aerial + Exterior",
    tags: ["Real Estate Dev"],
    location: "Dallas, TX",
    description:
      "A high-rise mixed-use development requiring aerial context renders and exterior massing visualizations for a developer pitch deck. We produced bird's-eye site views and ground-level exterior angles that gave investors a clear picture of the project's urban scale and impact.",
    coverImage:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80",
    ],
    filterCategory: "Aerial",
    layout: "equal",
  },
  {
    slug: "finch-kitchen-remodel",
    name: "The Finch Kitchen Remodel",
    type: "Interior",
    tags: ["Contractor"],
    location: "Nashville, TN",
    description:
      "A contractor-commissioned kitchen remodel visualization used to close a high-value residential job. The client needed to see the finished result before approving the project. Our renders showed three cabinet finish options side by side, leading to immediate sign-off and a premium upgrade selection.",
    coverImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80",
    ],
    filterCategory: "Interior",
    layout: "equal",
  },
  {
    slug: "westbrook-development-site",
    name: "Westbrook Development Site",
    type: "Aerial",
    tags: ["Property Marketing"],
    location: "Phoenix, AZ",
    description:
      "A large-scale residential development site requiring aerial context renders for a pre-launch marketing campaign. We delivered bird's-eye site overviews showing lot boundaries, massing, and surrounding infrastructure — giving buyers a clear sense of location and scale before ground broke.",
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80",
    ],
    filterCategory: "Aerial",
    layout: "equal",
  },
];
