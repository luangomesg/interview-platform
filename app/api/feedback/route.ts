import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { feedbackSchema } from '@/constants';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';

export async function POST(req: NextRequest) {
  const { interviewId, userId, transcript, feedbackId } = await req.json();

  try {
    const formattedTranscript = transcript.map(
      (sentence: { role: string; content: string }) =>
        `- ${sentence.role}: ${sentence.content} \n`
    ).join('');

    const result = await generateObject({
      model: google('gemini-2.0-flash-001', { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `\nYou are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.\nTranscript:\n${formattedTranscript}\n\nPlease score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:\n- **Communication Skills**: Clarity, articulation, structured responses.\n- **Technical Knowledge**: Understanding of key concepts for the role.\n- **Problem-Solving**: Ability to analyze problems and propose solutions.\n- **Cultural & Role Fit**: Alignment with company values and job role.\n- **Confidence & Clarity**: Confidence in responses, engagement, and clarity.\n`,
      system: "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } = result.object;

    const feedback = await db.collection('feedback').add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, feedbackId: feedback.id });
  } catch (error) {
    console.error('Error saving feedback', error);
    return NextResponse.json({ success: false });
  }
}
