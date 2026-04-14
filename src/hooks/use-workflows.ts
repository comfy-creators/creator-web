/** @format */

import { useQuery } from "@tanstack/react-query";

export interface WorkflowStats {
  generations: number;
  likes: number;
  comments: number;
  bookmarks: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  /**
   * Extended details about the workflow, such as the specific AI model used, recommended use cases, and tips for best results. This can be displayed on the workflow detail page to help users understand the strengths and ideal applications of this workflow.
   */
  details: string;
  thumbnailUrl: string;
  sampleOutputs: string[];
  stats: WorkflowStats;
}

// TODO: replace with real API call when backend workflow endpoint is ready
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "glamour-portrait",
    name: "Glamour Portrait",
    description:
      "Warm studio lighting with flawless skin retouching. Perfect for headshots, profile photos, and editorial portraits with a polished, high-fashion finish.",
    category: "Portrait",
    tags: ["Portrait", "Studio", "Retouch"],
    thumbnailUrl: "https://picsum.photos/seed/glamour-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/glamour-s1/800/600",
      "https://picsum.photos/seed/glamour-s2/800/600",
      "https://picsum.photos/seed/glamour-s3/800/600",
    ],
    stats: { generations: 18400, likes: 1240, comments: 94, bookmarks: 382 },
    details: "",
  },
  {
    id: "cinematic-headshot",
    name: "Cinematic Headshot",
    description:
      "Dramatic Rembrandt lighting with subtle film grain. Delivers editorial-quality results with a cinematic color grade that feels straight off a movie set.",
    category: "Portrait",
    tags: ["Portrait", "Cinematic", "Editorial"],
    thumbnailUrl: "https://picsum.photos/seed/cinematic-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/cinematic-s1/800/600",
      "https://picsum.photos/seed/cinematic-s2/800/600",
    ],
    stats: { generations: 9700, likes: 820, comments: 61, bookmarks: 215 },
    details: "",
  },
  {
    id: "fantasy-portrait",
    name: "Fantasy Portrait",
    description:
      "Ethereal backgrounds, magical color grading, and soft bokeh. Transforms ordinary portraits into otherworldly images with a painterly, luminous quality.",
    category: "Portrait",
    tags: ["Portrait", "Fantasy", "Ethereal"],
    thumbnailUrl: "https://picsum.photos/seed/fantasy-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/fantasy-s1/800/600",
      "https://picsum.photos/seed/fantasy-s2/800/600",
    ],
    stats: { generations: 6200, likes: 540, comments: 38, bookmarks: 170 },
    details: "",
  },
  {
    id: "epic-landscape",
    name: "Epic Landscape",
    description:
      "Sweeping vistas with dramatic golden-hour lighting and volumetric clouds. Ideal for art prints, wallpapers, and environmental concept art.",
    category: "Scene",
    tags: ["Landscape", "Nature", "Epic"],
    thumbnailUrl: "https://picsum.photos/seed/landscape-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/landscape-s1/800/600",
      "https://picsum.photos/seed/landscape-s2/800/600",
    ],
    stats: { generations: 14100, likes: 2100, comments: 147, bookmarks: 630 },
    details: "",
  },
  {
    id: "scifi-city",
    name: "Sci-Fi Cityscape",
    description:
      "Neon-soaked rain-slicked streets in a sprawling future metropolis. High detail with atmospheric fog, lens flares, and layered depth.",
    category: "Scene",
    tags: ["Sci-Fi", "Urban", "Neon"],
    thumbnailUrl: "https://picsum.photos/seed/scifi-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/scifi-s1/800/600",
      "https://picsum.photos/seed/scifi-s2/800/600",
    ],
    stats: { generations: 22300, likes: 3400, comments: 208, bookmarks: 910 },
    details: "",
  },
  {
    id: "product-clean",
    name: "Clean Product Render",
    description:
      "Studio-perfect white or neutral backgrounds with precise shadow and reflection. Drop-in ready for e-commerce listings and product catalogues.",
    category: "Product",
    tags: ["Product", "E-commerce", "Clean"],
    thumbnailUrl: "https://picsum.photos/seed/product-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/product-s1/800/600",
      "https://picsum.photos/seed/product-s2/800/600",
    ],
    stats: { generations: 31500, likes: 1890, comments: 122, bookmarks: 540 },
    details: "",
  },
  {
    id: "lifestyle-product",
    name: "Lifestyle Product",
    description:
      "Contextual product shots with styled environments and props. Tells a story around your product for social media, ads, and editorial placements.",
    category: "Product",
    tags: ["Product", "Lifestyle", "Social"],
    thumbnailUrl: "https://picsum.photos/seed/lifestyle-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/lifestyle-s1/800/600",
      "https://picsum.photos/seed/lifestyle-s2/800/600",
    ],
    stats: { generations: 8800, likes: 730, comments: 55, bookmarks: 280 },
    details: "",
  },
  {
    id: "abstract-art",
    name: "Abstract Composition",
    description:
      "Generative abstract art with rich color fields, flowing shapes, and fine-art textures. Every output is unique — no two generations are ever the same.",
    category: "Art",
    tags: ["Abstract", "Generative", "Art"],
    thumbnailUrl: "https://picsum.photos/seed/abstract-p/400/600",
    sampleOutputs: [
      "https://picsum.photos/seed/abstract-s1/800/600",
      "https://picsum.photos/seed/abstract-s2/800/600",
    ],
    stats: { generations: 5600, likes: 440, comments: 29, bookmarks: 145 },
    details: "",
  },
];

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async (): Promise<Workflow[]> => {
      // TODO: replace with real backend API call
      return MOCK_WORKFLOWS;
    },
    staleTime: Infinity,
  });
}
