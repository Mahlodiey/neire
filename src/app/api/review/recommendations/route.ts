import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth';
import { handleError } from '@/lib/errors';

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function buildRecommendation(mastery: number, confidence: number, dueAt: Date | null, attemptsCount: number) {
  const now = Date.now();
  const due = dueAt ? dueAt.getTime() <= now : false;
  const overdueDays = dueAt && due ? Math.max(0, Math.ceil((now - dueAt.getTime()) / 86_400_000)) : 0;

  if (mastery < 40 || confidence < 40) {
    return {
      action: 'TUTOR_EXPLANATION',
      label: 'Start with a guided explanation',
      reason: 'This topic needs foundational support before more testing.',
      steps: ['Review the key concepts with the tutor', 'Work through one simple example', 'Complete 3 low-difficulty practice questions'],
    };
  }

  if (mastery < 70) {
    return {
      action: 'PRACTICE',
      label: 'Practice the weak concepts',
      reason: 'Practice will strengthen understanding and expose remaining gaps.',
      steps: ['Review missed concepts', 'Complete 5 targeted questions', 'Explain the topic back to the tutor'],
    };
  }

  if (due || overdueDays > 0) {
    return {
      action: 'RECALL',
      label: 'Run a quick recall review',
      reason: overdueDays ? `This topic is ${overdueDays} day${overdueDays === 1 ? '' : 's'} overdue for review.` : 'Spaced repetition says this topic is ready for recall.',
      steps: ['Answer a short recall set', 'Check the explanation for each answer', 'Schedule the next review'],
    };
  }

  if (mastery >= 85 && confidence >= 80) {
    return {
      action: 'APPLICATION',
      label: 'Apply the topic in an exam challenge',
      reason: 'Strong mastery makes this topic ready for transfer and exam-level practice.',
      steps: ['Attempt a timed challenge', 'Review any uncertain answers', 'Move on to the next priority topic'],
    };
  }

  return {
    action: 'REVIEW',
    label: 'Complete a short review',
    reason: 'A brief review will maintain this topic and build confidence.',
    steps: ['Read the concept summary', 'Answer 2 review questions', 'Rate your confidence'],
  };
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    const limitParam = Number(req.nextUrl.searchParams.get('limit') || 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 10;

    const masteryRows = await prisma.topicMastery.findMany({
      where: { userId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            material: { select: { id: true, title: true } },
            reviewSchedules: {
              where: { userId },
              select: { dueAt: true, intervalDays: true, repetitions: true },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ mastery: 'asc' }, { confidence: 'asc' }],
      take: limit,
    });

    const recommendations = masteryRows.map((row) => {
      const schedule = row.topic.reviewSchedules[0];
      const recommendation = buildRecommendation(row.mastery, row.confidence, schedule?.dueAt ?? null, row.attemptsCount);
      const urgency = clamp(
        (100 - row.mastery) * 0.55 +
          (100 - row.confidence) * 0.25 +
          (schedule?.dueAt && schedule.dueAt.getTime() <= Date.now() ? 20 : 0)
      );

      return {
        topicId: row.topic.id,
        topic: row.topic.title,
        materialId: row.topic.material.id,
        materialTitle: row.topic.material.title,
        mastery: Math.round(row.mastery),
        confidence: Math.round(row.confidence),
        attemptsCount: row.attemptsCount,
        lastPracticedAt: row.lastPracticedAt,
        dueAt: schedule?.dueAt ?? null,
        urgency: Math.round(urgency),
        ...recommendation,
      };
    }).sort((a, b) => b.urgency - a.urgency);

    return NextResponse.json({ success: true, recommendations }, { status: 200 });
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
