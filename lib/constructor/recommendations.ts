import type {
  ConstructorFormValues,
  GiftRecommendation,
  Audience,
  Industry,
  BrandColor,
  Psychology,
  Priority
} from "@/types/constructor";

interface ProductTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;

  audiences: Audience[];
  industries: Industry[];
  colors: BrandColor[];
  psychology: Psychology[];
  priorities: Priority[];

  tags: string[];
}

const PRODUCTS: ProductTemplate[] = [
  {
    id: "executive-box",
    title: "Executive Gift Box",
    description:
      "Представительский подарочный набор с премиальной упаковкой и персонализацией.",
    category: "Premium",
    basePrice: 65000,
    audiences: ["partners", "clients", "awards"],
    industries: ["finance", "oil-gas", "government"],
    colors: ["black", "natural"],
    psychology: ["aesthetic", "status"],
    priorities: ["impression", "balance"],
    tags: ["Премиум", "Упаковка", "Персонализация"]
  },

  {
    id: "tech-welcome",
    title: "Tech Welcome Pack",
    description:
      "Современный welcome-набор для новых сотрудников технологичной компании.",
    category: "Welcome",
    basePrice: 28000,
    audiences: ["welcome", "employees"],
    industries: ["it", "finance", "education"],
    colors: ["black", "blue", "white"],
    psychology: ["practical", "explorer"],
    priorities: ["usefulness", "balance"],
    tags: ["Welcome", "Tech", "Команда"]
  },

  {
    id: "comfort-box",
    title: "Comfort Box",
    description:
      "Набор для отдыха, дома и повседневного использования.",
    category: "Lifestyle",
    basePrice: 22000,
    audiences: ["employees", "clients", "new-year"],
    industries: ["it", "medicine", "education", "horeca"],
    colors: ["natural", "green", "white"],
    psychology: ["home", "eco", "practical"],
    priorities: ["usefulness", "balance"],
    tags: ["Уют", "Забота", "Практичность"]
  },

  {
    id: "corporate-kit",
    title: "Corporate Kit",
    description:
      "Универсальный корпоративный набор для больших тиражей.",
    category: "Corporate",
    basePrice: 15000,
    audiences: ["employees", "clients", "event", "new-year"],
    industries: [
      "it",
      "finance",
      "construction",
      "retail",
      "education"
    ],
    colors: ["black", "blue", "red", "white"],
    psychology: ["practical"],
    priorities: ["usefulness", "balance"],
    tags: ["Тираж", "Мерч", "Брендирование"]
  },

  {
    id: "signature-award",
    title: "Signature Award",
    description:
      "Премиальная статуэтка или награда с индивидуальным дизайном.",
    category: "Awards",
    basePrice: 85000,
    audiences: ["awards", "partners", "clients"],
    industries: [
      "oil-gas",
      "finance",
      "government",
      "construction"
    ],
    colors: ["black", "natural", "blue"],
    psychology: ["aesthetic", "status"],
    priorities: ["impression"],
    tags: ["Статуэтка", "Награда", "Индивидуальный дизайн"]
  },

  {
    id: "eco-set",
    title: "Eco Corporate Set",
    description:
      "Корпоративный набор с акцентом на натуральные материалы и экологичную подачу.",
    category: "Eco",
    basePrice: 19000,
    audiences: ["employees", "clients", "partners", "event"],
    industries: [
      "it",
      "medicine",
      "education",
      "horeca"
    ],
    colors: ["natural", "green"],
    psychology: ["eco", "home"],
    priorities: ["usefulness", "balance"],
    tags: ["Eco", "Натуральные материалы", "B2B"]
  }
];

function calculateDiscount(quantity: number): number {
  if (quantity >= 500) return 0.15;
  if (quantity >= 200) return 0.1;
  if (quantity >= 100) return 0.07;
  if (quantity >= 50) return 0.04;

  return 0;
}

function scoreProduct(
  product: ProductTemplate,
  values: ConstructorFormValues
): {
  score: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  const audienceMatch = product.audiences.some((item) =>
    values.audience.includes(item)
  );

  if (audienceMatch) {
    score += 25;
    reasons.push("Подходит под выбранную аудиторию");
  }

  if (product.industries.includes(values.industry)) {
    score += 20;
    reasons.push("Подходит для вашей отрасли");
  }

  if (product.colors.includes(values.brandColor)) {
    score += 10;
    reasons.push("Соответствует цветовой стилистике бренда");
  }

  const psychologyMatches = product.psychology.filter((item) =>
    values.psychology.includes(item)
  );

  if (psychologyMatches.length > 0) {
    score += Math.min(25, psychologyMatches.length * 10);
    reasons.push("Соответствует предпочтениям получателей");
  }

  if (product.priorities.includes(values.priority)) {
    score += 10;
    reasons.push("Соответствует вашему приоритету");
  }

  const budgetDifference =
    Math.abs(
      product.basePrice - values.budgetPerPerson
    ) / values.budgetPerPerson;

  if (budgetDifference <= 0.15) {
    score += 15;
    reasons.push("Близко к вашему бюджету");
  } else if (budgetDifference <= 0.35) {
    score += 8;
  }

  if (
    values.deadline === "urgent" &&
    product.basePrice <= 30000
  ) {
    score += 5;
    reasons.push("Относительно простой вариант для срочного проекта");
  }

  return {
    score,
    reasons
  };
}

export function generateRecommendations(
  values: ConstructorFormValues
): GiftRecommendation[] {
  const discount = calculateDiscount(values.quantity);

  return PRODUCTS
    .map((product) => {
      const result = scoreProduct(product, values);

      const discountedPrice =
        Math.round(
          product.basePrice * (1 - discount)
        );

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        pricePerPerson: discountedPrice,
        totalPrice:
          discountedPrice * values.quantity,
        matchScore: Math.min(99, result.score),
        reasons: result.reasons,
        tags: product.tags
      };
    })
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    )
    .slice(0, 3);
}