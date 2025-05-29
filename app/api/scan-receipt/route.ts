import { prisma } from "@/lib/prisma";
import { Category } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/navigation";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) redirect("/sign-in");

        const { image, type, categories } = await req.json();

        // Remove data URL prefix
        const base64Image = image.split(",")[1];

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Analyze this receipt and extract the following information in JSON format:
        - total_amount: the total amount paid (just the number)
        - date: the transaction date in ISO format (YYYY-MM-DD)
        - description: a brief description of the purchase
        - category_suggestion: analyze the receipt content and select the MOST APPROPRIATE category from this EXACT list: [${categories.map((c: Category) => c.name).join(", ")}]. If none of these categories match well (confidence below 0.5), respond with "NEW_CATEGORY_NEEDED".
        - category_confidence: a number between 0 and 1 indicating how confident you are about the category suggestion
        - suggested_category_name: if category_suggestion is "NEW_CATEGORY_NEEDED", suggest an appropriate category name that would fit this transaction well

        Rules:
        1. category_suggestion MUST be exactly one of the provided categories or "NEW_CATEGORY_NEEDED"
        2. Match categories based on the receipt's content, merchant name, and items purchased
        3. Use exact category names from the provided list
        4. Consider common transaction patterns (e.g., supermarket -> Groceries)

        Example:
        {
            "total_amount": number,
            "date": "YYYY-MM-DD",
            "description": "string",
            "category_suggestion": "string",
            "category_confidence": number,
            "suggested_category_name": "string" // only if category_suggestion is "NEW_CATEGORY_NEEDED"
        }
        
        Return ONLY a valid JSON object with no formatting, code blocks, or additional text`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Clean up the response text
        const cleanJson = text.replace(/```json\n|\n```|```/g, '').trim();

        try {
            // Parse the cleaned JSON
            const extractedData = JSON.parse(cleanJson);

            // Add console logs for debugging
            console.log('Category Suggestion:', extractedData.category_suggestion);
            console.log('Category Confidence:', extractedData.category_confidence);
            console.log('New Category Needed:', extractedData.category_suggestion === 'NEW_CATEGORY_NEEDED');
            console.log('Suggested Category Name:', extractedData.suggested_category_name);
            return Response.json(extractedData);
        } catch (jsonError) {
            console.error("JSON parsing error:", jsonError, "Raw text:", text);
            return Response.json(
                { error: "Failed to parse receipt data" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Receipt scanning error:", error);
        return Response.json(
            { error: "Failed to scan receipt" },
            { status: 500 }
        );
    }
}