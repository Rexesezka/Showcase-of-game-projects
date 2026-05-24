"use client";

import { FormEvent, useState } from "react";

type RequiredField =
  | "firstName"
  | "lastName"
  | "company"
  | "position"
  | "contactDetails";

type FormFieldProps = {
  error?: boolean;
  label: string;
  name: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: "input" | "textarea";
};

const inputBaseClassName =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#262526] outline-none transition";

function getInputClassName(hasError: boolean) {
  return `${inputBaseClassName} ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-white/10 focus:border-[#31B2D3]"
  }`;
}

function FormField({
  error = false,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  required = false,
  type = "input",
}: FormFieldProps) {
  const className =
    type === "textarea"
      ? `${getInputClassName(error)} min-h-32 resize-y`
      : getInputClassName(error);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-white/80">{label}</span>
      {type === "textarea" ? (
        <textarea className={className} name={name} onBlur={onBlur} onChange={onChange} />
      ) : (
        <input
          className={className}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type="text"
        />
      )}
      {error ? (
        <p className="mt-1.5 pl-6 text-xs text-red-500">Заполните это поле</p>
      ) : null}
    </label>
  );
}

export default function ExpertApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<RequiredField, boolean>>>({});

  function setFieldError(name: RequiredField, hasError: boolean) {
    setErrors((prev) => ({ ...prev, [name]: hasError }));
  }

  function validateRequiredField(name: RequiredField, value: string) {
    const hasError = !value.trim();
    setFieldError(name, hasError);
    return !hasError;
  }

  function handleRequiredBlur(name: RequiredField, value: string) {
    validateRequiredField(name, value);
  }

  function handleRequiredChange(name: RequiredField, value: string) {
    if (errors[name] && value.trim()) {
      setFieldError(name, false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const requiredFields: RequiredField[] = [
      "firstName",
      "lastName",
      "company",
      "position",
      "contactDetails",
    ];

    const nextErrors = requiredFields.reduce<Partial<Record<RequiredField, boolean>>>(
      (acc, field) => {
        acc[field] = !String(formData.get(field) ?? "").trim();
        return acc;
      },
      {},
    );

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(formData.get("firstName") ?? "").trim(),
          lastName: String(formData.get("lastName") ?? "").trim(),
          middleName: String(formData.get("middleName") ?? "").trim(),
          company: String(formData.get("company") ?? "").trim(),
          position: String(formData.get("position") ?? "").trim(),
          contactDetails: String(formData.get("contactDetails") ?? "").trim(),
          comment: String(formData.get("comment") ?? "").trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setSubmitError(data.error ?? "Не удалось отправить заявку. Попробуйте позже.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-[#FFE278]/30 bg-white/[0.03] p-8 text-center">
        <p className="text-lg font-semibold text-[#FFE278]">Заявка отправлена</p>
        <p className="mt-3 text-sm text-white/70">
          Спасибо! Мы свяжемся с вами после рассмотрения заявки.
        </p>
      </div>
    );
  }

  return (
    <form className="mx-auto max-w-xl space-y-4" onSubmit={handleSubmit} noValidate>
      <FormField
        error={errors.firstName}
        label="Имя*"
        name="firstName"
        onBlur={(event) => handleRequiredBlur("firstName", event.target.value)}
        onChange={(event) => handleRequiredChange("firstName", event.target.value)}
        required
      />

      <FormField
        error={errors.lastName}
        label="Фамилия*"
        name="lastName"
        onBlur={(event) => handleRequiredBlur("lastName", event.target.value)}
        onChange={(event) => handleRequiredChange("lastName", event.target.value)}
        required
      />

      <FormField label="Отчество" name="middleName" />

      <FormField
        error={errors.company}
        label="Название компании*"
        name="company"
        onBlur={(event) => handleRequiredBlur("company", event.target.value)}
        onChange={(event) => handleRequiredChange("company", event.target.value)}
        required
      />

      <FormField
        error={errors.position}
        label="Должность*"
        name="position"
        onBlur={(event) => handleRequiredBlur("position", event.target.value)}
        onChange={(event) => handleRequiredChange("position", event.target.value)}
        required
      />

      <FormField
        error={errors.contactDetails}
        label="Контактные данные*"
        name="contactDetails"
        onBlur={(event) => handleRequiredBlur("contactDetails", event.target.value)}
        onChange={(event) => handleRequiredChange("contactDetails", event.target.value)}
        placeholder="Email / Telegram/ VK / MAX"
        required
      />

      <FormField
        label="Оставить комментарий или задать вопрос"
        name="comment"
        type="textarea"
      />

      {submitError ? <p className="text-center text-sm text-red-400">{submitError}</p> : null}

      <div className="mt-2 flex justify-center">
        <button
          className="rounded-full bg-[#FFE278] px-12 py-3 text-sm font-semibold uppercase tracking-wide text-[#262526] transition hover:bg-[#ffd95a] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </button>
      </div>
    </form>
  );
}
