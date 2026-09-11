const pdfParse = require("pdf-parse")

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service")

const interviewReportModel =
    require("../models/interviewReport.model")


// =====================================================
// Generate Interview Report
// =====================================================
async function generateInterViewReportController(
    req,
    res
) {

    try {

        // ---------------------------------------------
        // Check resume
        // ---------------------------------------------
        if (!req.file) {

            return res.status(400).json({
                message: "Resume PDF is required."
            })
        }


        // ---------------------------------------------
        // Extract resume text
        // ---------------------------------------------
        const resumeContent =
            await (
                new pdfParse.PDFParse(
                    Uint8Array.from(
                        req.file.buffer
                    )
                )
            ).getText()


        // ---------------------------------------------
        // Get form-data
        // ---------------------------------------------
        const {
            title,
            selfDescription,
            jobDescription
        } = req.body


        // ---------------------------------------------
        // Validate title
        // ---------------------------------------------
        if (
            !title ||
            !title.trim()
        ) {

            return res.status(400).json({
                message: "Job title is required."
            })
        }


        // ---------------------------------------------
        // Validate job description
        // ---------------------------------------------
        if (
            !jobDescription ||
            !jobDescription.trim()
        ) {

            return res.status(400).json({
                message:
                    "Job description is required."
            })
        }


        // ---------------------------------------------
        // Generate AI report
        // ---------------------------------------------
        console.log(
            "Generating interview report..."
        )


        const interViewReportByAi =
            await generateInterviewReport({

                resume:
                    resumeContent.text,

                selfDescription,

                jobDescription

            })


        // ---------------------------------------------
        // Validate AI response
        // ---------------------------------------------
        if (
            !interViewReportByAi
        ) {

            return res.status(500).json({
                message:
                    "AI did not return an interview report."
            })
        }


        if (
            !Array.isArray(
                interViewReportByAi
                    .technicalQuestions
            ) ||
            interViewReportByAi
                .technicalQuestions.length < 5
        ) {

            return res.status(500).json({
                message:
                    "AI returned fewer than 5 technical questions."
            })
        }


        if (
            !Array.isArray(
                interViewReportByAi
                    .behavioralQuestions
            ) ||
            interViewReportByAi
                .behavioralQuestions.length < 5
        ) {

            return res.status(500).json({
                message:
                    "AI returned fewer than 5 behavioral questions."
            })
        }


        if (
            !Array.isArray(
                interViewReportByAi
                    .skillGaps
            ) ||
            interViewReportByAi
                .skillGaps.length < 3
        ) {

            return res.status(500).json({
                message:
                    "AI returned fewer than 3 skill gaps."
            })
        }


        if (
            !Array.isArray(
                interViewReportByAi
                    .preparationPlan
            ) ||
            interViewReportByAi
                .preparationPlan.length < 7
        ) {

            return res.status(500).json({
                message:
                    "AI returned fewer than 7 preparation days."
            })
        }


        // ---------------------------------------------
        // Save in MongoDB
        // ---------------------------------------------
        const interviewReport =
            await interviewReportModel.create({

                user:
                    req.user.id,

                resume:
                    resumeContent.text,

                selfDescription,

                jobDescription,

                // AI generated fields
                ...interViewReportByAi,

                // User-provided job title
                title:
                    title.trim()

            })


        // ---------------------------------------------
        // Success response
        // ---------------------------------------------
        return res.status(201).json({

            message:
                "Interview report generated successfully.",

            interviewReport

        })

    } catch (error) {

        console.error(
            "================================="
        )

        console.error(
            "Generate Interview Report Error:"
        )

        console.error(
            error
        )

        console.error(
            "================================="
        )


        return res.status(500).json({

            message:
                error.message ||
                "Unable to generate interview report."

        })
    }
}


// =====================================================
// Get Interview Report By ID
// =====================================================
async function getInterviewReportByIdController(
    req,
    res
) {

    try {

        const {
            interviewId
        } = req.params


        const interviewReport =
            await interviewReportModel.findOne({

                _id:
                    interviewId,

                user:
                    req.user.id

            })


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found."

            })
        }


        return res.status(200).json({

            message:
                "Interview report fetched successfully.",

            interviewReport

        })

    } catch (error) {

        console.error(
            "Get Interview Report Error:",
            error
        )


        return res.status(500).json({

            message:
                "Unable to fetch interview report."

        })
    }
}


// =====================================================
// Get All Interview Reports
// =====================================================
async function getAllInterviewReportsController(
    req,
    res
) {

    try {

        const interviewReports =
            await interviewReportModel

                .find({
                    user:
                        req.user.id
                })

                .sort({
                    createdAt: -1
                })

                .select(
                    "-resume " +
                    "-selfDescription " +
                    "-jobDescription " +
                    "-__v " +
                    "-technicalQuestions " +
                    "-behavioralQuestions " +
                    "-skillGaps " +
                    "-preparationPlan"
                )


        return res.status(200).json({

            message:
                "Interview reports fetched successfully.",

            interviewReports

        })

    } catch (error) {

        console.error(
            "Get All Interview Reports Error:",
            error
        )


        return res.status(500).json({

            message:
                "Unable to fetch interview reports."

        })
    }
}


// =====================================================
// Generate Resume PDF
// =====================================================
async function generateResumePdfController(
    req,
    res
) {

    try {

        const {
            interviewReportId
        } = req.params


        const interviewReport =
            await interviewReportModel.findOne({

                _id:
                    interviewReportId,

                user:
                    req.user.id

            })


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found."

            })
        }


        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport


        // ---------------------------------------------
        // Generate PDF
        // ---------------------------------------------
        const pdfBuffer =
            await generateResumePdf({

                resume,

                jobDescription,

                selfDescription

            })


        // ---------------------------------------------
        // Send PDF
        // ---------------------------------------------
        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`

        })


        return res.send(
            pdfBuffer
        )

    } catch (error) {

        console.error(
            "Generate Resume PDF Error:",
            error
        )


        return res.status(500).json({

            message:
                error.message ||
                "Unable to generate resume PDF."

        })
    }
}


// =====================================================
// Exports
// =====================================================
module.exports = {

    generateInterViewReportController,

    getInterviewReportByIdController,

    getAllInterviewReportsController,

    generateResumePdfController

}