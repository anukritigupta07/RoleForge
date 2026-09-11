const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")


// =====================================================
// Gemini Client
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// =====================================================
// Zod Schema
// Used AFTER Gemini returns JSON
// =====================================================

const technicalQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
})

const behavioralQuestionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string()
})

const skillGapSchema = z.object({
    skill: z.string(),
    severity: z.enum(["low", "medium", "high"])
})

const preparationDaySchema = z.object({
    day: z.number(),
    focus: z.string(),
    tasks: z.array(z.string())
})

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100),

    technicalQuestions: z.array(
        technicalQuestionSchema
    ),

    behavioralQuestions: z.array(
        behavioralQuestionSchema
    ),

    skillGaps: z.array(
        skillGapSchema
    ),

    preparationPlan: z.array(
        preparationDaySchema
    )
})


// =====================================================
// Explicit JSON Schema for Gemini
// =====================================================

const interviewReportJsonSchema = {
    type: "object",

    properties: {

        matchScore: {
            type: "number",
            description:
                "A score from 0 to 100 showing how well the candidate matches the job."
        },

        technicalQuestions: {
            type: "array",
            description:
                "Exactly 5 technical interview questions.",
            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "The technical interview question."
                    },

                    intention: {
                        type: "string",
                        description:
                            "What the interviewer wants to evaluate."
                    },

                    answer: {
                        type: "string",
                        description:
                            "How the candidate should answer the question."
                    }
                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",
            description:
                "Exactly 5 behavioral interview questions.",

            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "The behavioral interview question."
                    },

                    intention: {
                        type: "string",
                        description:
                            "What behavior or quality the interviewer wants to evaluate."
                    },

                    answer: {
                        type: "string",
                        description:
                            "How the candidate should answer the question."
                    }
                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        skillGaps: {
            type: "array",
            description:
                "At least 3 skill gaps relevant to the target job.",

            items: {
                type: "object",

                properties: {

                    skill: {
                        type: "string",
                        description:
                            "The skill the candidate should improve."
                    },

                    severity: {
                        type: "string",
                        enum: [
                            "low",
                            "medium",
                            "high"
                        ],
                        description:
                            "Importance of the skill gap."
                    }
                },

                required: [
                    "skill",
                    "severity"
                ]
            }
        },

        preparationPlan: {
            type: "array",
            description:
                "Exactly 7 days of interview preparation.",

            items: {
                type: "object",

                properties: {

                    day: {
                        type: "integer",
                        description:
                            "Preparation day number from 1 to 7."
                    },

                    focus: {
                        type: "string",
                        description:
                            "Main topic for the day."
                    },

                    tasks: {
                        type: "array",

                        items: {
                            type: "string"
                        },

                        description:
                            "Specific preparation tasks."
                    }
                },

                required: [
                    "day",
                    "focus",
                    "tasks"
                ]
            }
        }
    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
}


// =====================================================
// Generate Interview Report
// =====================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are an expert technical interviewer and hiring manager.

Analyze the candidate's resume and self-description against
the target job description.

========================
CANDIDATE RESUME
========================

${resume}

========================
SELF DESCRIPTION
========================

${selfDescription || "Not provided"}

========================
JOB DESCRIPTION
========================

${jobDescription}

========================
TASK
========================

Generate an interview preparation report.

You MUST return:

1. matchScore
   - Number between 0 and 100.

2. technicalQuestions
   - EXACTLY 5 objects.

3. behavioralQuestions
   - EXACTLY 5 objects.

4. skillGaps
   - AT LEAST 3 objects.

5. preparationPlan
   - EXACTLY 7 objects.
   - Days must be 1 through 7.

========================
VERY IMPORTANT
========================

technicalQuestions MUST look like:

[
  {
    "question": "...",
    "intention": "...",
    "answer": "..."
  }
]

behavioralQuestions MUST look like:

[
  {
    "question": "...",
    "intention": "...",
    "answer": "..."
  }
]

skillGaps MUST look like:

[
  {
    "skill": "...",
    "severity": "low"
  }
]

preparationPlan MUST look like:

[
  {
    "day": 1,
    "focus": "...",
    "tasks": ["...", "..."]
  }
]

DO NOT return strings inside these arrays.

DO NOT return:

[
  "question 1",
  "question 2"
]

Instead return objects with the required fields.

Do not copy the resume or job description into the answer.

Do not return explanations outside the JSON.

Do not invent experience that is not present in the resume.

Return ONLY JSON.
`


    try {

        console.log(
            "Sending interview report request to Gemini..."
        )


        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3-flash-preview",

                contents:
                    prompt,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        interviewReportJsonSchema

                }

            })


        if (
            !response ||
            !response.text
        ) {

            throw new Error(
                "Gemini returned an empty response."
            )
        }


        console.log(
            "RAW GEMINI RESPONSE:"
        )

        console.log(
            response.text
        )


        // ---------------------------------------------
        // Parse JSON
        // ---------------------------------------------

        let result

        try {

            result =
                JSON.parse(
                    response.text
                )

        } catch (error) {

            console.error(
                "JSON parsing failed:",
                error
            )

            throw new Error(
                "Gemini returned invalid JSON."
            )
        }


        // ---------------------------------------------
        // Validate with Zod
        // ---------------------------------------------

        const validatedResult =
            interviewReportSchema.safeParse(
                result
            )


        if (
            !validatedResult.success
        ) {

            console.error(
                "AI RESPONSE DOES NOT MATCH SCHEMA:"
            )

            console.error(
                validatedResult.error
                    .issues
            )

            throw new Error(
                "Gemini returned data in an invalid format."
            )
        }


        const report =
            validatedResult.data


        // ---------------------------------------------
        // Validate number of questions
        // ---------------------------------------------

        if (
            report.technicalQuestions.length < 5
        ) {

            throw new Error(
                `Gemini returned only ${report.technicalQuestions.length} technical questions.`
            )
        }


        if (
            report.behavioralQuestions.length < 5
        ) {

            throw new Error(
                `Gemini returned only ${report.behavioralQuestions.length} behavioral questions.`
            )
        }


        if (
            report.skillGaps.length < 3
        ) {

            throw new Error(
                `Gemini returned only ${report.skillGaps.length} skill gaps.`
            )
        }


        if (
            report.preparationPlan.length < 7
        ) {

            throw new Error(
                `Gemini returned only ${report.preparationPlan.length} preparation days.`
            )
        }


        console.log(
            "Interview report successfully validated."
        )


        return report

    } catch (error) {

        console.error(
            "===================================="
        )

        console.error(
            "GEMINI INTERVIEW REPORT ERROR"
        )

        console.error(
            error
        )

        console.error(
            "===================================="
        )

        throw error
    }
}


// =====================================================
// Generate PDF From HTML
// =====================================================

async function generatePdfFromHtml(
    htmlContent
) {

    const browser =
        await puppeteer.launch({
            headless: true
        })

    try {

        const page =
            await browser.newPage()


        await page.setContent(
            htmlContent,
            {
                waitUntil: "networkidle0"
            }
        )


        const pdfBuffer =
            await page.pdf({

                format: "A4",

                printBackground: true,

                margin: {

                    top: "20mm",

                    bottom: "20mm",

                    left: "15mm",

                    right: "15mm"

                }

            })


        return pdfBuffer

    } finally {

        await browser.close()
    }
}


// =====================================================
// Resume PDF Schema
// =====================================================

const resumePdfSchema = {
    type: "object",

    properties: {

        html: {
            type: "string",
            description:
                "Complete HTML content of the resume."
        }

    },

    required: ["html"]
}


// =====================================================
// Generate Resume PDF
// =====================================================

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Create a professional ATS-friendly resume.

CURRENT RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB:
${jobDescription}

Requirements:

- Return ONLY JSON.
- Return one field called "html".
- The html field must contain the complete resume.
- Tailor the resume to the target job.
- Do not invent experience.
- Do not invent education.
- Do not invent achievements.
- Do not invent projects.
- Keep it professional.
- Keep it ATS friendly.
- Keep it around 1-2 pages.
`


    try {

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3-flash-preview",

                contents:
                    prompt,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        resumePdfSchema

                }

            })


        if (
            !response ||
            !response.text
        ) {

            throw new Error(
                "Gemini returned an empty resume response."
            )
        }


        const jsonContent =
            JSON.parse(
                response.text
            )


        if (
            !jsonContent.html
        ) {

            throw new Error(
                "Gemini did not return resume HTML."
            )
        }


        const pdfBuffer =
            await generatePdfFromHtml(
                jsonContent.html
            )


        return pdfBuffer

    } catch (error) {

        console.error(
            "Resume PDF Error:",
            error
        )

        throw error
    }
}


// =====================================================
// Export
// =====================================================

module.exports = {
    generateInterviewReport,
    generateResumePdf
}