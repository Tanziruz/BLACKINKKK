"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { Stagger, StaggerItem, SlideInLeft, SlideInRight, FadeUp } from "../Animate";

const contactSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().optional(),
        phone: z.string().optional(),
        subject: z.string().min(3, "Subject must be at least 3 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
    })
    .superRefine((data, ctx) => {
        const hasEmail = data.email && data.email.trim().length > 0;
        const hasPhone = data.phone && data.phone.replace(/\D/g, "").length >= 7;

        if (!hasEmail && !hasPhone) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid email", path: ["email"] });
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number is too short", path: ["phone"] });
        }
        if (hasEmail) {
            const emailResult = z.string().email("Enter a valid email").safeParse(data.email);
            if (!emailResult.success) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: emailResult.error.issues[0].message, path: ["email"] });
            }
        }
        if (hasPhone) {
            const phoneResult = z
                .string()
                .min(7, "Phone number is too short")
                .regex(/^[+\d\s\-().]+$/, "Enter a valid phone number")
                .safeParse(data.phone);
            if (!phoneResult.success) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: phoneResult.error.issues[0].message, path: ["phone"] });
            }
        }
    });

type ContactFields = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const empty: ContactFields = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

function InfoCard({ icon: Icon, value, label }: { icon: typeof Mail; value: string; label: string }) {
    return (
        <div className="flex-1 min-w-0 flex flex-col items-center gap-3 bg-beige rounded-2xl px-6 py-6 text-center">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-black shrink-0">
                <Icon size={20} color="#ffffff" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col gap-0.5">
                <p className="font-Inter text-black font-medium text-[15px] tracking-[-0.02em] leading-snug mb-0!">
                    {value}
                </p>
                <p className="font-Inter text-black/50 text-[13px] tracking-[-0.01em] leading-none mb-0!">
                    {label}
                </p>
            </div>
        </div>
    );
}

const inputBase =
    "w-full bg-white rounded-xl px-4 py-3 font-Inter text-[14px] text-black placeholder:text-black/35 tracking-[-0.02em] outline-none focus:ring-2 transition";

function Field({
    label,
    type = "text",
    placeholder,
    value,
    error,
    className = "",
    onChange,
    onBlur,
}: {
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    error?: string;
    className?: string;
    onChange: (v: string) => void;
    onBlur: () => void;
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="font-Inter text-black text-[14px] tracking-[-0.02em] font-medium">
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                suppressHydrationWarning
                className={`${inputBase} ${error ? "ring-2 ring-red-400" : "focus:ring-black/10"}`}
            />
            {error && (
                <p className="font-Inter text-red-500 text-[12px] tracking-[-0.01em] mb-0!">{error}</p>
            )}
        </div>
    );
}

export default function ContactForm() {
    const [values, setValues] = useState<ContactFields>(empty);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState(false);

    const [dialCode, setDialCode] = useState("+91");
    const [phoneNum, setPhoneNum] = useState("");

    function handleDialInput(val: string) {
        const normalized = val.startsWith("+") ? val : "+" + val.replace(/^\++/, "");
        setDialCode(normalized);
        const full = (normalized + " " + phoneNum).trim();
        setValues((prev) => ({ ...prev, phone: full }));
        const result = contactSchema.safeParse({ ...values, phone: full });
        const phoneError = result.success ? undefined : result.error.issues.find((i) => i.path[0] === "phone");
        if (!phoneError) setErrors((prev) => ({ ...prev, phone: undefined }));
    }

    function set(field: keyof ContactFields) {
        return (v: string) => {
            const next = { ...values, [field]: v };
            setValues(next);
            const result = contactSchema.safeParse(next);
            if (result.success) {
                setErrors({});
            } else {
                const fieldError = result.error.issues.find((i) => i.path[0] === field);
                if (!fieldError) setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        };
    }

    function handlePhoneNum(num: string) {
        setPhoneNum(num);
        const full = (dialCode + " " + num).trim();
        setValues((prev) => ({ ...prev, phone: full }));
        const result = contactSchema.safeParse({ ...values, phone: full });
        const phoneError = result.success ? undefined : result.error.issues.find((i) => i.path[0] === "phone");
        if (!phoneError) setErrors((prev) => ({ ...prev, phone: undefined }));
    }

    function blurField(field: keyof ContactFields) {
        return () => {
            const result = contactSchema.safeParse(values);
            if (result.success) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            } else {
                const fieldError = result.error.issues.find((i) => i.path[0] === field);
                setErrors((prev) => ({
                    ...prev,
                    [field]: fieldError ? fieldError.message : undefined,
                }));
            }
        };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const result = contactSchema.safeParse(values);
        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            result.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof ContactFields;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setSending(true);
        setSendError(false);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_URL!, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed");
            setSubmitted(true);
            setValues(empty);
            setPhoneNum("");
        } catch {
            setSendError(true);
        } finally {
            setSending(false);
        }
    }

    return (
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-14 lg:py-18 flex flex-col gap-5">

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.1}>
                <StaggerItem><InfoCard icon={Mail} value="Blackinkkk@aol.com" label="Email Address" /></StaggerItem>
                <StaggerItem><InfoCard icon={Phone} value="+91 98103 67883" label="Phone Number" /></StaggerItem>
                <StaggerItem><InfoCard icon={MapPin} value="Ghaziabad, Uttar Pradesh 201001" label="Location" /></StaggerItem>
            </Stagger>

            <div className="flex flex-col lg:flex-row gap-0 bg-beige rounded-2xl overflow-hidden">

                <SlideInLeft className="relative w-full lg:w-[38%] aspect-4/3 lg:aspect-auto lg:min-h-135 shrink-0">
                    <Image src="/Contact.avif" alt="Contact" fill className="object-cover object-center" />
                </SlideInLeft>

                <SlideInRight delay={0.08} className="flex-1">
                <form className="flex flex-col gap-4 px-6 sm:px-8 py-8 h-full" noValidate onSubmit={handleSubmit}>

                    {submitted && (
                        <div className="bg-black text-white font-Inter text-[14px] tracking-[-0.02em] rounded-xl px-4 py-3">
                            Message sent! We&apos;ll get back to you soon.
                        </div>
                    )}
                    {sendError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 font-Inter text-[14px] tracking-[-0.02em] rounded-xl px-4 py-3">
                            Something went wrong. Please try again.
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="First Name" placeholder="Nasir" value={values.firstName} error={errors.firstName} onChange={set("firstName")} onBlur={blurField("firstName")} />
                        <Field label="Last Name" placeholder="Nawaz" value={values.lastName} error={errors.lastName} onChange={set("lastName")} onBlur={blurField("lastName")} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label={`Email${values.phone ? " (optional)" : ""}`} type="email" placeholder="test@gmail.com" value={values.email ?? ""} error={errors.email} onChange={set("email")} onBlur={blurField("email")} />
                        {/* Phone — code input + number input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-Inter text-black text-[14px] tracking-[-0.02em] font-medium">
                                Phone No{values.email ? " (optional)" : ""}
                            </label>
                            <div className={`flex rounded-xl overflow-hidden bg-white transition ${
                                errors.phone ? "ring-2 ring-red-400" : "focus-within:ring-2 focus-within:ring-black/10"
                            }`}>
                                <input
                                    type="text"
                                    value={dialCode}
                                    onChange={(e) => handleDialInput(e.target.value)}
                                    suppressHydrationWarning
                                    placeholder="+91"
                                    className="w-16 shrink-0 bg-transparent border-r border-black/10 pl-3 pr-1 py-3 font-Inter text-[14px] text-black tracking-[-0.02em] outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="98103 67883"
                                    value={phoneNum}
                                    onChange={(e) => handlePhoneNum(e.target.value)}
                                    onBlur={() => {
                                        const full = (dialCode + " " + phoneNum).trim();
                                        const next = { ...values, phone: full };
                                        const result = contactSchema.safeParse(next);
                                        const phoneError = result.success ? undefined : result.error.issues.find((i) => i.path[0] === "phone");
                                        setErrors((prev) => ({
                                            ...prev,
                                            phone: phoneError ? phoneError.message : undefined,
                                        }));
                                    }}
                                    suppressHydrationWarning
                                    className="flex-1 min-w-0 bg-transparent px-4 py-3 font-Inter text-[14px] text-black placeholder:text-black/35 tracking-[-0.02em] outline-none"
                                />
                            </div>
                            {errors.phone && (
                                <p className="font-Inter text-red-500 text-[12px] tracking-[-0.01em] mb-0!">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    <Field label="Subject" placeholder="Enquiry ...." value={values.subject} error={errors.subject} onChange={set("subject")} onBlur={blurField("subject")} />

                    <div className="flex flex-col gap-1.5">
                        <label className="font-Inter text-black text-[14px] tracking-[-0.02em] font-medium">Message</label>
                        <textarea
                            placeholder="Enter message here..."
                            rows={5}
                            value={values.message}
                            onChange={(e) => set("message")(e.target.value)}
                            onBlur={blurField("message")}
                            suppressHydrationWarning
                            className={`${inputBase} resize-y ${errors.message ? "ring-2 ring-red-400" : "focus:ring-black/10"}`}
                        />
                        {errors.message && (
                            <p className="font-Inter text-red-500 text-[12px] tracking-[-0.01em] mb-0!">{errors.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-black text-white font-Inter text-[15px] tracking-[-0.02em] py-3.5 rounded-2xl hover:bg-black/85 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {sending ? "Sending…" : "Send Message"}
                    </button>
                </form>
                </SlideInRight>
            </div>

        </section>
    );
}
