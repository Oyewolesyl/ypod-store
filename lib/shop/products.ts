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
  customizable?: boolean;
  colors: ProductColor[];
  wraps: string[];
  features: string[];
  specs: Record<string, string>;
  whatsInTheBox: string[];
  faqs: { question: string; answer: string }[];
};

export const colorOptions: ProductColor[] = [
  { name: "soft white", value: "#f4f0e8" },
  { name: "midnight black", value: "#111111" },
  { name: "sand", value: "#c9b79f" },
  { name: "deep blue", value: "#17223a" },
];

export const wrapOptions = ["matte black"];

export const products: Product[] = [
  {
    id: "yema-lite",
    slug: "yema-lite",
    name: "yema lite",
    tagline: "the accessible entry into the ypod sleep ecosystem",
    description: "a simpler, lighter entry sleep-audio product built to make ypod easier to start with while keeping yema-1 and yema pro premium.",
    price: "₦75,000",
    priceValue: 75000,
    category: "lite earbuds",
    images: [
      "/assets/nobg/yema-lite-in-case-nobg.png",
      "/assets/nobg/yema-lite-ivory-left-nobg.png",
      "/assets/nobg/yema-lite-graphite-right-nobg.png",
    ],
    colors: colorOptions,
    wraps: [],
    features: ["entry price point", "compact sleep-audio form", "simple charging case", "sleep-audio ecosystem entry"],
    specs: {
      fit: "compact sleep-audio earbud direction",
      controls: "phone first",
      finish: "ivory or graphite direction",
      purpose: "affordable entry product",
    },
    whatsInTheBox: ["yema lite earbuds", "charging case", "silicone tip set", "usb-c cable", "quick start guide"],
    faqs: [
      {
        question: "why make a lite version?",
        answer: "it gives more people a way into ypod while preserving premium pricing for yema-1, yema pro, and the remote system.",
      },
      {
        question: "does lite replace yema-1?",
        answer: "no. yema lite is the accessible entry product. yema-1 stays the core circular identity model.",
      },
    ],
  },
  {
    id: "sleep-earbuds",
    slug: "ypod-sleep-earbuds",
    name: "yema-1",
    tagline: "low-profile sleep audio for calm nights",
    description: "a soft, compact sleep-audio earbud concept for night routines, sound masking, music, and private listening without reaching for a bright phone.",
    price: "₦185,000",
    priceValue: 185000,
    category: "earbuds",
    images: ["/assets/nobg/yema-1-left-ear-nobg.png", "/assets/nobg/yema-1-right-ear-nobg.png", "/assets/yema-case-white.png"],
    colors: colorOptions,
    wraps: [],
    features: ["low-profile earbud body", "soft silicone fit", "phone-first controls", "quiet matte finish"],
    specs: {
      fit: "compact in-ear sleep profile",
      controls: "phone first",
      finish: "matte black or soft grey direction",
      charging: "usb-c charging case concept",
    },
    whatsInTheBox: ["ypod sleep earbuds", "charging case", "silicone tip set", "usb-c cable", "quick start guide"],
    faqs: [
      {
        question: "is this a medical sleep product?",
        answer: "no. ypod is positioned as consumer sleep-audio hardware, not a medical treatment device.",
      },
      {
        question: "can it play normal audio?",
        answer: "yes. the product direction supports sleep sounds, music, podcasts, and routine audio.",
      },
    ],
  },
  {
    id: "yema-pro",
    slug: "yema-pro",
    name: "yema pro",
    tagline: "the flatter side-sleeper model",
    description: "a lower-profile oval sleepbud direction for side sleepers, shaped to sit deeper in the concha and reduce pillow pressure.",
    price: "₦225,000",
    priceValue: 225000,
    category: "pro earbuds",
    images: ["/assets/nobg/yema-pro-left-ear-nobg.png", "/assets/nobg/yema-pro-right-ear-nobg.png", "/assets/fit-study-final.png"],
    colors: colorOptions,
    wraps: [],
    features: ["low-profile oval form", "side-sleeper comfort direction", "stable concha fit", "premium sleep-focused identity"],
    specs: {
      fit: "low-profile oval concha direction",
      purpose: "side-sleeper pressure reduction",
      finish: "matte black or soft grey direction",
      control: "phone and remote",
    },
    whatsInTheBox: ["yema pro earbuds", "charging case", "silicone tip set", "usb-c cable", "quick start guide"],
    faqs: [
      {
        question: "how is yema pro different?",
        answer: "yema pro is shaped around side-sleeper pressure and stability, while yema-1 protects the locked circular product identity.",
      },
      {
        question: "is the fit final?",
        answer: "the store presents the product direction. physical prototypes and user fit testing should validate the final shell before manufacturing.",
      },
    ],
  },
  {
    id: "remote",
    slug: "ypod-remote",
    name: "ypod remote",
    tagline: "bedside control without touching your earbuds",
    description: "a small premium controller for sleep audio. play, pause, skip, go back, or start a saved dream routine from your bedside.",
    price: "₦95,000",
    priceValue: 95000,
    category: "remote",
    images: ["/assets/nobg/black-controller-nobg.png", "/assets/nobg/kuromi-wrapped-controller-nobg.png", "/assets/remote/ypod-remote-system.png"],
    modelPath: "/models/ypod-controller.glb",
    customizable: true,
    colors: colorOptions,
    wraps: wrapOptions,
    features: ["physical play/pause", "previous and next controls", "dream routine button", "real controller skin preview"],
    specs: {
      control: "play, pause, previous, next, dream",
      connection: "bluetooth low energy concept",
      charging: "rechargeable concept",
      customization: "matte black, supplied print skins, and customer uploads",
    },
    whatsInTheBox: ["ypod remote", "usb-c cable", "starter wrap card", "quick start guide"],
    faqs: [
      {
        question: "what does the dream button do?",
        answer: "it is designed to start a saved bedtime routine such as a preferred sound, volume, timer, fade-out, or night preset.",
      },
      {
        question: "can the remote be customized?",
        answer: "yes. the remote is the customizable product: matte black, supplied prints, and customer image upload.",
      },
    ],
  },
  {
    id: "bundle",
    slug: "ypod-bundle",
    name: "ypod bundle",
    tagline: "earbuds, case, remote, and personalization together",
    description: "the full ypod sleep ecosystem concept: low-profile earbuds, charging case, bedside remote, and customization options in one premium kit.",
    price: "₦255,000",
    priceValue: 255000,
    category: "bundle",
    images: ["/assets/nobg/yema-lite-in-case-nobg.png", "/assets/nobg/black-controller-nobg.png", "/assets/nobg/yema-pro-left-ear-nobg.png"],
    colors: colorOptions,
    wraps: [],
    features: ["sleep earbuds", "charging case", "remote controller", "optional remote skin"],
    specs: {
      system: "sleep earbuds + remote + case",
      finish: "matte black product family",
      control: "phone and remote",
      personalization: "remote skins and accessories",
    },
    whatsInTheBox: ["ypod sleep earbuds", "charging case", "ypod remote", "wrap starter pack", "usb-c cable"],
    faqs: [
      {
        question: "why bundle the remote?",
        answer: "the remote turns ypod into a bedside sleep system instead of only another pair of bluetooth earbuds.",
      },
      {
        question: "is checkout live?",
        answer: "the store supports preorder reservation and payment references while final production, shipping, and support terms are confirmed.",
      },
    ],
  },
  {
    id: "wraps",
    slug: "custom-wraps",
    name: "custom wraps",
    tagline: "collectible skins for your sleep setup",
    description: "personalization packs for the ypod remote and future product surfaces, made for room style, limited drops, and brand collaborations.",
    price: "₦12,000",
    priceValue: 12000,
    category: "accessories",
    images: ["/assets/nobg/kuromi-wrapped-controller-nobg.png", "/assets/remote/ypod-remote-showcase.png", "/assets/remote/ypod-remote-system.png"],
    colors: colorOptions,
    wraps: [],
    features: ["supplied print skins", "brand partnership potential", "remote skin support", "customer upload direction"],
    specs: {
      surface: "remote-first wrap concept",
      formats: "supplied print skins and customer upload",
      launch: "small-batch drops",
      custom: "upload an image for a controller skin preview",
    },
    whatsInTheBox: ["selected wrap", "application card", "cleaning cloth"],
    faqs: [
      {
        question: "can brands make exclusive skins?",
        answer: "yes. brand and artist collaborations are part of the accessory revenue plan.",
      },
      {
        question: "can customers upload designs?",
        answer: "yes. customers can upload an image in the shop customizer and preview it against the controller model.",
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
