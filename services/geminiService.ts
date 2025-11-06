
import { GoogleGenAI, Type } from "@google/genai";
import type { SchoolRecommendation, SubjectMarks } from "../types";

// FIX: Aligned with coding guidelines to use process.env.API_KEY directly.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        institutionName: {
          type: Type.STRING,
          description: "The full name of the South African university or college.",
        },
        institutionType: {
          type: Type.STRING,
          description: "The type of institution, e.g., 'University', 'TVET College', or 'Private College'.",
        },
        website: {
          type: Type.STRING,
          description: "The official website URL of the institution.",
        },
        recommendedCourses: {
          type: Type.ARRAY,
          description: "A list of courses recommended for the student based on their marks.",
          items: {
            type: Type.OBJECT,
            properties: {
              courseName: {
                type: Type.STRING,
                description: "The name of the degree or diploma, e.g., 'Bachelor of Science in Computer Science'.",
              },
              apsScore: {
                type: Type.NUMBER,
                description: "The minimum Admission Point Score (APS) required for the course, if applicable."
              },
              requirements: {
                type: Type.ARRAY,
                description: "Specific subject and minimum percentage requirements for the course.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: {
                      type: Type.STRING,
                      description: "The required high school subject.",
                    },
                    minimumMark: {
                      type: Type.NUMBER,
                      description: "The minimum percentage required for the subject.",
                    },
                  },
                  required: ["subject", "minimumMark"],
                },
              },
            },
            required: ["courseName", "requirements"],
          },
        },
      },
      required: ["institutionName", "institutionType", "website", "recommendedCourses"],
    },
};

export const getSchoolRecommendations = async (subjectMarks: SubjectMarks, averageMark: number | null): Promise<SchoolRecommendation[]> => {
  const subjectList = Object.entries(subjectMarks)
      .map(([subject, mark]) => `- ${subject}: ${mark}%`)
      .join('\n');

  const averageMarkString = averageMark !== null
    ? `Student's Overall Average: ${averageMark}%\n`
    : '';

  const prompt = `
    You are an expert career guidance counselor for South African high school students.
    Based on the student's marks, please recommend a list of 3 to 5 suitable South African tertiary institutions (Universities, TVET Colleges, and Private Colleges).

    ${averageMarkString}
    Student's Subject Marks:
    ${subjectList}

    For each institution, please provide:
    1.  The full name of the institution.
    2.  The type of institution (University, TVET College, or Private College).
    3.  The official website URL.
    4.  A list of 2-3 specific, suitable courses or faculties that a student with these marks could likely get into. Pay close attention to the provided marks when recommending courses. Use the overall average as a primary filter if available, and then the individual subject marks for specific course requirements.
    5.  For each recommended course, list the TYPICAL key subject requirements and the minimum percentage mark required (e.g., "Mathematics: 60%"). Since you have individual subject marks, your recommendations should be more accurate. If available, also include the minimum Admission Point Score (APS).

    Focus on realistic recommendations based on the provided marks. Your entire response MUST be in a valid JSON format that adheres to the provided schema. Do not include any introductory text, closing remarks, or any other content outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as SchoolRecommendation[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get recommendations. The AI model may be temporarily unavailable. Please try again later.");
  }
};
