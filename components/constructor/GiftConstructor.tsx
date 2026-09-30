"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FormProvider,
  useForm,
  useFormContext
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AUDIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  BRAND_COLOR_OPTIONS,
  PSYCHOLOGY_OPTIONS,
  DEADLINE_OPTIONS,
  FORMAT_OPTIONS,
  PRIORITY_OPTIONS
} from "@/types/constructor";

import type {
  ConstructorFormValues,
  WizardStep
} from "@/types/constructor";

import { constructorSchema } from "@/lib/validation/constructor";
import { generateRecommendations } from "@/lib/constructor/recommendations";
import { useConstructorStore } from "@/store/constructor.store";

import { SelectionCard } from "./SelectionCard";

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function Progress() {
  const currentStep = useConstructorStore(
    (state) => state.currentStep
  );

  return (
    <div className="mb-10 -translate-y-10">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">
          Шаг {currentStep} из 6
        </span>

        <span className="text-neutral-500">
          {Math.round((currentStep / 6) * 100)}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <motion.div
          className="h-full rounded-full bg-black"
          animate={{
            width: `${(currentStep / 6) * 100}%`
          }}
        />
      </div>
    </div>
  );
}

function AudienceStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setAudience = useConstructorStore(
    (state) => state.setAudience
  );

  const selected = watch("audience");

  function toggle(id: ConstructorFormValues["audience"][number]) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    setValue("audience", next, {
      shouldValidate: true
    });

    setAudience(next);
  }

  return (
    <StepLayout
      title="Для кого создаём подарок?"
      description="Можно выбрать несколько вариантов."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {AUDIENCE_OPTIONS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.title}
            description={item.description}
            selected={selected.includes(item.id)}
            multi
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

function BudgetStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setQuantity = useConstructorStore(
    (state) => state.setQuantity
  );

  const setBudget = useConstructorStore(
    (state) => state.setBudgetPerPerson
  );

  const quantity = watch("quantity");
  const budgetPerPerson =
    watch("budgetPerPerson");

  const total = quantity * budgetPerPerson;

  function updateQuantity(value: string) {
    const number = Number(value) || 0;

    setValue("quantity", number, {
      shouldValidate: true
    });

    setQuantity(number);
  }

  function updateBudget(value: string) {
    const number = Number(value) || 0;

    setValue("budgetPerPerson", number, {
      shouldValidate: true
    });

    setBudget(number);
  }

  return (
    <StepLayout 
      title="Какой объём и бюджет?"
      description="Бюджет на человека и общий бюджет пересчитываются автоматически."
    >
      <div className="grid gap-6 md:grid-cols-2 -translate-y-12">
        <NumberField
          label="Количество"
          suffix="шт."
          value={quantity}
          min={1}
          onChange={updateQuantity}
        />

        <NumberField
          label="Бюджет на человека"
          suffix="₸"
          value={budgetPerPerson}
          min={5000}
          onChange={updateBudget}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-black p-6 text-white -translate-y-12">
        <div className="text-sm text-neutral-400">
          Ориентировочный общий бюджет
        </div>

        <div className="mt-2 text-3xl font-bold">
          {formatPrice(total)} ₸
        </div>
      </div>
    </StepLayout>
  );
}

function IndustryStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setIndustry = useConstructorStore(
    (state) => state.setIndustry
  );

  const selected = watch("industry");

  return (
    <StepLayout
      title="В какой отрасли работает компания?"
      description="Это поможет подобрать более подходящую стилистику."
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {INDUSTRY_OPTIONS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.title}
            selected={selected === item.id}
            onClick={() => {
              setValue("industry", item.id, {
                shouldValidate: true
              });

              setIndustry(item.id);
            }}
          />
        ))}
      </div>
    </StepLayout>
  );
}

function BrandingStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setBrandColor = useConstructorStore(
    (state) => state.setBrandColor
  );

  const selected = watch("brandColor");

  return (
    <StepLayout
      title="Какая цветовая стилистика бренда?"
      description="Позже цвет можно будет заменить на конкретные значения фирменного брендбука."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {BRAND_COLOR_OPTIONS.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            whileHover={{ y: -3 }}
            onClick={() => {
              setValue("brandColor", item.id, {
                shouldValidate: true
              });

              setBrandColor(item.id);
            }}
            className={[
              "rounded-2xl border p-4 text-left transition",
              selected === item.id
                ? "border-black shadow-lg"
                : "border-neutral-200"
            ].join(" ")}
          >
            <div
              className="mb-4 h-16 rounded-xl border"
              style={{
                backgroundColor: item.value
              }}
            />

            <div className="font-semibold">
              {item.title}
            </div>
          </motion.button>
        ))}
      </div>
    </StepLayout>
  );
}

function PsychologyStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setPsychology = useConstructorStore(
    (state) => state.setPsychology
  );

  const selected = watch("psychology");

  function toggle(
    id: ConstructorFormValues["psychology"][number]
  ) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : selected.length < 4
        ? [...selected, id]
        : selected;

    setValue("psychology", next, {
      shouldValidate: true
    });

    setPsychology(next);
  }

  return (
    <StepLayout
      title="Что важно получателям?"
      description="Выберите до четырёх предпочтений."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {PSYCHOLOGY_OPTIONS.map((item) => (
          <SelectionCard
            key={item.id}
            title={item.title}
            description={item.description}
            selected={selected.includes(item.id)}
            multi
            onClick={() => toggle(item.id)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

function LogisticsStep() {
  const { watch, setValue } =
    useFormContext<ConstructorFormValues>();

  const setDeadline = useConstructorStore(
    (state) => state.setDeadline
  );

  const setFormat = useConstructorStore(
    (state) => state.setFormat
  );

  const setPriority = useConstructorStore(
    (state) => state.setPriority
  );

  const deadline = watch("deadline");
  const format = watch("format");
  const priority = watch("priority");

  return (
    <StepLayout
      title="Сроки и формат проекта"
      description="Это влияет на состав и технологию производства."
    >
      <div>
        <SectionTitle title="Когда нужен заказ?" />

        <div className="grid gap-3 md:grid-cols-3">
          {DEADLINE_OPTIONS.map((item) => (
            <SelectionCard
              key={item.id}
              title={item.title}
              description={item.description}
              selected={deadline === item.id}
              onClick={() => {
                setValue("deadline", item.id, {
                  shouldValidate: true
                });

                setDeadline(item.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Формат сотрудничества" />

        <div className="grid gap-3 md:grid-cols-2">
          {FORMAT_OPTIONS.map((item) => (
            <SelectionCard
              key={item.id}
              title={item.title}
              selected={format === item.id}
              onClick={() => {
                setValue("format", item.id, {
                  shouldValidate: true
                });

                setFormat(item.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title="Что важнее?" />

        <div className="grid gap-3 md:grid-cols-3">
          {PRIORITY_OPTIONS.map((item) => (
            <SelectionCard
              key={item.id}
              title={item.title}
              selected={priority === item.id}
              onClick={() => {
                setValue("priority", item.id, {
                  shouldValidate: true
                });

                setPriority(item.id);
              }}
            />
          ))}
        </div>
      </div>
    </StepLayout>
  );
}

function StepLayout({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      transition={{
        duration: 0.3
      }}
    >
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl -translate-y-8">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-neutral-500 -translate-y-8">
        {description}
      </p>

      <div className="mt-8">
        {children}
      </div>
    </motion.div>
  );
}

function SectionTitle({
  title
}: {
  title: string;
}) {
  return (
    <h3 className="mb-4 text-lg font-semibold">
      {title}
    </h3>
  );
}

function NumberField({
  label,
  suffix,
  value,
  min,
  onChange
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
      </span>

      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 pr-16 text-lg outline-none transition focus:border-black"
        />

        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
          {suffix}
        </span>
      </div>
    </label>
  );
}

function ResultStep() {
  const result = useConstructorStore(
    (state) => state.result
  );

  const reset = useConstructorStore(
    (state) => state.reset
  );

  if (!result) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Logoart подбор
        </div>

        <h2 className="text-3xl font-bold md:text-5xl">
          Мы подобрали 3 решения
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
          Это предварительные концепции. После заявки мы
          адаптируем состав, брендирование, упаковку и
          стоимость под ваш проект.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {result.recommendations.map(
          (recommendation, index) => (
            <motion.article
              key={recommendation.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.1
              }}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="flex h-44 items-center justify-center bg-neutral-950 p-8 text-white">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                    {recommendation.category}
                  </div>

                  <div className="mt-3 text-2xl font-bold">
                    LOGOART
                  </div>

                  <div className="mt-2 text-sm text-neutral-400">
                    {recommendation.tags[0]}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                    Совпадение {recommendation.matchScore}%
                  </span>

                  <span className="text-xs text-neutral-400">
                    Вариант {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold">
                  {recommendation.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  {recommendation.description}
                </p>

                <div className="mt-5">
                  <div className="text-sm text-neutral-400">
                    Ориентир за человека
                  </div>

                  <div className="mt-1 text-2xl font-bold">
                    {formatPrice(
                      recommendation.pricePerPerson
                    )}{" "}
                    ₸
                  </div>
                </div>

                <div className="mt-5 border-t border-neutral-100 pt-5">
                  <div className="text-sm font-semibold">
                    Почему подходит:
                  </div>

                  <ul className="mt-3 space-y-2">
                    {recommendation.reasons
                      .slice(0, 4)
                      .map((reason) => (
                        <li
                          key={reason}
                          className="flex gap-2 text-sm text-neutral-500"
                        >
                          <span className="text-black">
                            ✓
                          </span>

                          {reason}
                        </li>
                      ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-neutral-800"
                >
                  Запросить расчёт
                </button>
              </div>
            </motion.article>
          )
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium underline underline-offset-4"
        >
          Изменить задачу
        </button>
      </div>
    </motion.div>
  );
}

const STEP_FIELDS: Record<
  WizardStep,
  (keyof ConstructorFormValues)[]
> = {
  1: ["audience"],
  2: ["quantity", "budgetPerPerson"],
  3: ["industry"],
  4: ["brandColor"],
  5: ["psychology"],
  6: [
    "deadline",
    "format",
    "priority"
  ]
};

export function GiftConstructor() {
  const store = useConstructorStore();

  const methods = useForm<ConstructorFormValues>({
    resolver: zodResolver(constructorSchema),
    defaultValues: {
      audience: store.audience,
      quantity: store.quantity,
      budgetPerPerson:
        store.budgetPerPerson,
      industry: store.industry,
      brandColor: store.brandColor,
      psychology: store.psychology,
      deadline: store.deadline,
      format: store.format,
      priority: store.priority
    },
    mode: "onChange"
  });

  const {
    handleSubmit,
    trigger,
    reset: resetForm
  } = methods;

  const currentStep =
    store.currentStep;

  const totalBudget = useMemo(() => {
    return (
      store.quantity *
      store.budgetPerPerson
    );
  }, [
    store.quantity,
    store.budgetPerPerson
  ]);

  async function next() {
    const valid = await trigger(
      STEP_FIELDS[currentStep]
    );

    if (!valid) {
      return;
    }

    if (currentStep < 6) {
      store.nextStep();
      return;
    }

    await handleSubmit(generate)();
  }

  async function generate(
    values: ConstructorFormValues
  ) {
    store.setIsGenerating(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    const recommendations =
      generateRecommendations(values);

    store.setResult({
      recommendations,
      createdAt:
        new Date().toISOString()
    });

    store.setIsGenerating(false);
  }

  function resetAll() {
    store.reset();

    resetForm({
      audience: ["employees"],
      quantity: 50,
      budgetPerPerson: 25000,
      industry: "it",
      brandColor: "black",
      psychology: ["practical"],
      deadline: "two-three-weeks",
      format: "one-time",
      priority: "balance"
    });
  }

  if (store.result) {
    return (
      <section
        id="constructor"
        className="mx-auto max-w-7xl px-5 py-24"
      >
        <ResultStep />
      </section>
    );
  }

  return (
    <section
      id="constructor"
      className="mx-auto max-w-5xl px-5 py-24"
    >
      <FormProvider {...methods}>
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-2xl shadow-black/5 md:p-10">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              LOGOART BUILDER
            </div>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Подберём корпоративное решение
            </h2>

            <p className="mt-3 max-w-2xl text-neutral-500">
              Ответьте на несколько вопросов —
              система сформирует три концепции
              под ваш бюджет и задачу.
            </p>
          </div>

          <Progress />

          <div className="min-h-[480px]">
            {currentStep === 1 && (
              <AudienceStep />
            )}

            {currentStep === 2 && (
              <BudgetStep />
            )}

            {currentStep === 3 && (
              <IndustryStep />
            )}

            {currentStep === 4 && (
              <BrandingStep />
            )}

            {currentStep === 5 && (
              <PsychologyStep />
            )}

            {currentStep === 6 && (
              <LogisticsStep />
            )}
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={
                currentStep === 1
                  ? resetAll
                  : store.previousStep
              }
              className="rounded-xl px-5 py-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
            >
              {currentStep === 1
                ? "Сбросить"
                : "← Назад"}
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <div className="text-xs text-neutral-400">
                  Ориентировочный бюджет
                </div>

                <div className="font-semibold">
                  {formatPrice(totalBudget)} ₸
                </div>
              </div>

              <button
                type="button"
                disabled={store.isGenerating}
                onClick={next}
                className="rounded-xl bg-black px-7 py-3.5 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {store.isGenerating
                  ? "Подбираем..."
                  : currentStep === 6
                    ? "Подобрать решения →"
                    : "Далее →"}
              </button>
            </div>
          </div>
        </div>
      </FormProvider>
    </section>
  );
}