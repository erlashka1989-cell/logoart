export const AUDIENCE_OPTIONS = [
  {
    id: "employees",
    title: "Сотрудники",
    description: "Для команды и внутренних корпоративных подарков"
  },
  {
    id: "clients",
    title: "Клиенты",
    description: "Для клиентов и важных заказчиков"
  },
  {
    id: "partners",
    title: "Партнёры",
    description: "Для ключевых партнёров и контрагентов"
  },
  {
    id: "welcome",
    title: "Welcome pack",
    description: "Для новых сотрудников"
  },
  {
    id: "new-year",
    title: "Новый год",
    description: "Новогодние корпоративные подарки"
  },
  {
    id: "event",
    title: "Мероприятие",
    description: "Форумы, конференции, выставки"
  },
  {
    id: "awards",
    title: "Награждение",
    description: "Статуэтки, награды, памятные подарки"
  }
] as const;

export const INDUSTRY_OPTIONS = [
  { id: "it", title: "IT / технологии" },
  { id: "oil-gas", title: "Нефть и газ" },
  { id: "finance", title: "Финансы / банки" },
  { id: "medicine", title: "Медицина" },
  { id: "horeca", title: "HoReCa" },
  { id: "construction", title: "Строительство" },
  { id: "education", title: "Образование" },
  { id: "government", title: "Госсектор" },
  { id: "retail", title: "Ритейл" },
  { id: "other", title: "Другая отрасль" }
] as const;

export const BRAND_COLOR_OPTIONS = [
  {
    id: "black",
    title: "Чёрный",
    value: "#111111"
  },
  {
    id: "white",
    title: "Белый",
    value: "#F5F5F5"
  },
  {
    id: "blue",
    title: "Синий",
    value: "#2563EB"
  },
  {
    id: "green",
    title: "Зелёный",
    value: "#16803C"
  },
  {
    id: "red",
    title: "Красный",
    value: "#B91C1C"
  },
  {
    id: "natural",
    title: "Натуральные",
    value: "#B99A72"
  }
] as const;

export const PSYCHOLOGY_OPTIONS = [
  {
    id: "aesthetic",
    title: "Красота и детали",
    description: "Сдержанный стиль, цельная подача"
  },
  {
    id: "practical",
    title: "Практичность",
    description: "Полезные вещи на каждый день"
  },
  {
    id: "explorer",
    title: "Новые впечатления",
    description: "Технологии, путешествия и необычные решения"
  },
  {
    id: "home",
    title: "Дом и уют",
    description: "Тёплые повседневные ритуалы"
  },
  {
    id: "status",
    title: "Статус",
    description: "Премиальная подача и представительский уровень"
  },
  {
    id: "eco",
    title: "Эко",
    description: "Натуральные и экологичные материалы"
  }
] as const;

export const DEADLINE_OPTIONS = [
  {
    id: "urgent",
    title: "Срочно",
    description: "До 7 дней"
  },
  {
    id: "two-three-weeks",
    title: "2–3 недели",
    description: "Стандартный срок"
  },
  {
    id: "month",
    title: "Около месяца",
    description: "Можно разработать более сложное решение"
  }
] as const;

export const FORMAT_OPTIONS = [
  {
    id: "one-time",
    title: "Разовый заказ"
  },
  {
    id: "annual",
    title: "Планируем регулярно"
  }
] as const;

export const PRIORITY_OPTIONS = [
  {
    id: "usefulness",
    title: "Практичность"
  },
  {
    id: "impression",
    title: "Впечатление"
  },
  {
    id: "balance",
    title: "Баланс"
  }
] as const;

export type Audience =
  (typeof AUDIENCE_OPTIONS)[number]["id"];

export type Industry =
  (typeof INDUSTRY_OPTIONS)[number]["id"];

export type BrandColor =
  (typeof BRAND_COLOR_OPTIONS)[number]["id"];

export type Psychology =
  (typeof PSYCHOLOGY_OPTIONS)[number]["id"];

export type Deadline =
  (typeof DEADLINE_OPTIONS)[number]["id"];

export type CooperationFormat =
  (typeof FORMAT_OPTIONS)[number]["id"];

export type Priority =
  (typeof PRIORITY_OPTIONS)[number]["id"];

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface ConstructorFormValues {
  audience: Audience[];
  quantity: number;
  budgetPerPerson: number;
  industry: Industry;
  brandColor: BrandColor;
  psychology: Psychology[];
  deadline: Deadline;
  format: CooperationFormat;
  priority: Priority;
}

export interface GiftRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  pricePerPerson: number;
  totalPrice: number;
  matchScore: number;
  reasons: string[];
  tags: string[];
}

export interface ConstructorResult {
  recommendations: GiftRecommendation[];
  createdAt: string;
}

export interface ConstructorState extends ConstructorFormValues {
  currentStep: WizardStep;
  result: ConstructorResult | null;
  isGenerating: boolean;

  setAudience: (value: Audience[]) => void;
  setQuantity: (value: number) => void;
  setBudgetPerPerson: (value: number) => void;
  setIndustry: (value: Industry) => void;
  setBrandColor: (value: BrandColor) => void;
  setPsychology: (value: Psychology[]) => void;
  setDeadline: (value: Deadline) => void;
  setFormat: (value: CooperationFormat) => void;
  setPriority: (value: Priority) => void;

  nextStep: () => void;
  previousStep: () => void;
  setStep: (step: WizardStep) => void;

  setResult: (result: ConstructorResult | null) => void;
  setIsGenerating: (value: boolean) => void;

  reset: () => void;
}