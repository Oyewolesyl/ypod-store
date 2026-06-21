export type ProductColor = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  priceValue: number;
  category: string;
  images: string[];
  modelPath?: string;
  colors: ProductColor[];
  wraps: string[];
  features: string[];
  specs: Record<string, string>;
  whatsInTheBox: string[];
  faqs: { question: string; answer: string }[];
};

export const colorOptions: ProductColor[] = [
  { name: "Soft White", value: "#f4f0e8" },
  { name: "Midnight Black", value: "#111111" },
  { name: "Sand", value: "#c9b79f" },
  { name: "Deep Blue", value: "#17223a" },
];

export const wrapOptions = [
  "Minimal",
  "Calm Gradient",
  "Abstract",
  "Space",
  "Nature",
  "Upload Your Image",
];

export const products: Product[] = [
  {
    id: "yema-lite",
    slug: "yema-lite",
    name: "YEMA Lite",
    tagline: "the accessible entry into the YPOD sleep ecosystem",
    description:
      "A simpler, lighter entry sleep-audio product built to make YPOD easier to start with while keeping YEMA-1 and YEMA PRO premium.",
    price: "₦75,000",
    priceValue: 75000,
    category: "lite earbuds",
    images: [
      "/assets/nobg/yema-lite-in-case-nobg.png",
      "/assets/nobg/yema-lite-ivory-left-nobg.png",
      "/assets/nobg/yema-lite-graphite-right-nobg.png",
    ],
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Entry price point", "Compact sleep-audio form", "Simple charging case", "Wrap-ready ecosystem"],
    specs: {
      fit: "compact sleep-audio earbud direction",
      controls: "phone first",
      finish: "ivory or graphite direction",
      purpose: "affordable entry product",
    },
    whatsInTheBox: ["YEMA Lite earbuds", "Charging case", "Silicone tip set", "USB-C cable", "Quick start guide"],
    faqs: [
      {
        question: "Why make a Lite version?",
        answer: "It gives more people a way into YPOD while preserving premium pricing for YEMA-1, YEMA PRO, and the remote system.",
      },
      {
        question: "Does Lite replace YEMA-1?",
        answer: "No. YEMA Lite is the accessible entry product. YEMA-1 stays the core circular identity model.",
      },
    ],
  },
  {
    id: "sleep-earbuds",
    slug: "ypod-sleep-earbuds",
    name: "YPOD Sleep Earbuds",
    tagline: "low-profile sleep audio for calm nights",
    description:
      "A soft, compact sleep-audio earbud concept for night routines, sound masking, music, and private listening without reaching for a bright phone.",
    price: "₦185,000",
    priceValue: 185000,
    category: "earbuds",
    images: ["/assets/nobg/yema-1-left-ear-nobg.png", "/assets/nobg/yema-1-right-ear-nobg.png", "/assets/yema-case-white.png"],
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Low-profile earbud body", "Soft silicone fit", "Phone-first controls", "Quiet matte finish"],
    specs: {
      fit: "compact in-ear sleep profile",
      controls: "phone first",
      finish: "matte black or soft grey direction",
      charging: "USB-C charging case concept",
    },
    whatsInTheBox: ["YPOD sleep earbuds", "Charging case", "Silicone tip set", "USB-C cable", "Quick start guide"],
    faqs: [
      {
        question: "Is this a medical sleep product?",
        answer: "No. YPOD is positioned as consumer sleep-audio hardware, not a medical treatment device.",
      },
      {
        question: "Can it play normal audio?",
        answer: "Yes. The product direction supports sleep sounds, music, podcasts, and routine audio.",
      },
    ],
  },
  {
    id: "yema-pro",
    slug: "yema-pro",
    name: "YEMA PRO",
    tagline: "the flatter side-sleeper model",
    description:
      "A lower-profile oval sleepbud direction for side sleepers, shaped to sit deeper in the concha and reduce pillow pressure.",
    price: "₦225,000",
    priceValue: 225000,
    category: "pro earbuds",
    images: ["/assets/nobg/yema-pro-left-ear-nobg.png", "/assets/nobg/yema-pro-right-ear-nobg.png", "/assets/fit-study-final.png"],
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Low-profile oval form", "Side-sleeper comfort direction", "Stable concha fit", "Premium sleep-focused identity"],
    specs: {
      fit: "low-profile oval concha direction",
      purpose: "side-sleeper pressure reduction",
      finish: "matte black or soft grey direction",
      control: "phone and remote",
    },
    whatsInTheBox: ["YEMA PRO earbuds", "Charging case", "Silicone tip set", "USB-C cable", "Quick start guide"],
    faqs: [
      {
        question: "How is YEMA PRO different?",
        answer: "YEMA PRO is shaped around side-sleeper pressure and stability, while YEMA-1 protects the locked circular product identity.",
      },
      {
        question: "Is the fit final?",
        answer: "The store presents the product direction. Physical prototypes and user fit testing should validate the final shell before manufacturing.",
      },
    ],
  },
  {
    id: "remote",
    slug: "ypod-remote",
    name: "YPOD Remote",
    tagline: "bedside control without touching your earbuds",
    description:
      "A small premium controller for sleep audio. Play, pause, skip, go back, or start a saved dream routine from your bedside.",
    price: "₦95,000",
    priceValue: 95000,
    category: "remote",
    images: ["/assets/nobg/black-controller-nobg.png", "/assets/nobg/kuromi-wrapped-controller-nobg.png", "/assets/remote/ypod-remote-system.png"],
    modelPath: "/models/ypod-controller.glb",
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Physical play/pause", "Previous and next controls", "Dream routine button", "Collectible wrap support"],
    specs: {
      control: "play, pause, previous, next, dream",
      connection: "Bluetooth Low Energy concept",
      charging: "rechargeable concept",
      customization: "wraps, skins, and attachable accessories",
    },
    whatsInTheBox: ["YPOD Remote", "USB-C cable", "Starter wrap card", "Quick start guide"],
    faqs: [
      {
        question: "What does the dream button do?",
        answer: "It is designed to start a saved bedtime routine such as a preferred sound, volume, timer, fade-out, or night preset.",
      },
      {
        question: "Can the remote be customized?",
        answer: "Yes. The product direction supports matte colors, collectible wraps, skins, and attachable keychain-style accessories.",
      },
    ],
  },
  {
    id: "bundle",
    slug: "ypod-bundle",
    name: "YPOD Bundle",
    tagline: "earbuds, case, remote, and personalization together",
    description:
      "The full YPOD sleep ecosystem concept: low-profile earbuds, charging case, bedside remote, and customization options in one premium kit.",
    price: "₦255,000",
    priceValue: 255000,
    category: "bundle",
    images: ["/assets/nobg/yema-lite-in-case-nobg.png", "/assets/nobg/black-controller-nobg.png", "/assets/nobg/yema-pro-left-ear-nobg.png"],
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Sleep earbuds", "Charging case", "Remote controller", "Wrap and skin options"],
    specs: {
      system: "sleep earbuds + remote + case",
      finish: "matte black product family",
      control: "phone and remote",
      personalization: "colors, wraps, skins, and accessories",
    },
    whatsInTheBox: ["YPOD sleep earbuds", "Charging case", "YPOD Remote", "Wrap starter pack", "USB-C cable"],
    faqs: [
      {
        question: "Why bundle the remote?",
        answer: "The remote turns YPOD into a bedside sleep system instead of only another pair of Bluetooth earbuds.",
      },
      {
        question: "Is checkout live?",
        answer: "Not yet. Payments stay paused until inventory, shipping, support, and launch terms are ready.",
      },
    ],
  },
  {
    id: "wraps",
    slug: "custom-wraps",
    name: "Custom Wraps",
    tagline: "collectible skins for your sleep setup",
    description:
      "Personalization packs for the YPOD remote and future product surfaces, made for room style, limited drops, and brand collaborations.",
    price: "₦12,000",
    priceValue: 12000,
    category: "accessories",
    images: ["/assets/nobg/kuromi-wrapped-controller-nobg.png", "/assets/remote/ypod-remote-showcase.png", "/assets/remote/ypod-remote-system.png"],
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["Collectible designs", "Brand partnership potential", "Remote skin support", "Customer upload flow"],
    specs: {
      surface: "remote-first wrap concept",
      formats: "minimal, gradient, abstract, space, nature",
      launch: "small-batch drops",
      custom: "upload an image for a controller skin preview",
    },
    whatsInTheBox: ["Selected wrap", "Application card", "Cleaning cloth"],
    faqs: [
      {
        question: "Can brands make exclusive skins?",
        answer: "Yes. Brand and artist collaborations are part of the accessory revenue plan.",
      },
      {
        question: "Can customers upload designs?",
        answer: "Yes. Customers can upload an image in the shop customizer and preview it against the controller model.",
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
