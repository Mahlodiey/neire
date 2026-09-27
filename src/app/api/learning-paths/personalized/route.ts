import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth';
import { handleError } from '@/lib/errors';

async function getTrendSignals(userId: string) {
  const masteryRows = await prisma.topicMastery.findMany({
    where: { userId },
    include: { topic: { select: { title: true, material: { select: { title: true } } } } },
    orderBy: [{ mastery: 'asc' }],
  });

  const attempts = await prisma.answerAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const latest = masteryRows.length ? masteryRows : [];
  const averageMastery = latest.length ? latest.reduce((sum, item) => sum + item.mastery, 0) / latest.length : 0;
  const strongTopics = latest.filter((item) => item.mastery >= 80).map((item) => item.topic.title);
  const weakTopics = latest.filter((item) => item.mastery < 60).map((item) => item.topic.title);

  const accuracy = attempts.length
    ? Math.round((attempts.filter((attempt) => attempt.isCorrect).length / attempts.length) * 100)
    : 0;

  return {
    averageMastery,
    strongTopics,
    weakTopics,
    accuracy,
    draftSignals: {
      needsSupport: weakTopics.length >= 2 || accuracy < 60,
      readyForChallenge: strongTopics.length >= 2 && accuracy >= 75,
    },
  };
}

function buildLearningPath(signals: ReturnType<typeof getTrendSignals> extends Promise<infer T> ? T : never) {
  const { weakTopics, strongTopics, accuracy, averageMastery, draftSignals } = signals;

  const path = [] as Array<{ title: string; activity: string; reason: string; priority: 'low' | 'medium' | 'high' }>;

  if (draftSignals.needsSupport) {
    weakTopics.slice(0, 3).forEach((topic) => {
      path.push({
        title: topic,
        activity: 'Foundational review',
        reason: 'This topic is below the mastery threshold and needs reinforcement before new material.',
        priority: 'high',
      });
    });
  }

  if (accuracy < 70) {
    path.push({
      title: 'Error analysis',
      activity: 'Review misconceptions',
      reason: 'Your recent performance suggests mistakes are clustering around key concepts and explanations.',
      priority: 'high',
    });
  }

  if (averageMastery >= 70) {
    strongTopics.slice(0, 2).forEach((topic) => {
      path.push({
        title: topic,
        activity: 'Exam challenge',
        reason: 'You are ready to stretch your understanding with timed application questions.',
        priority: 'medium',
      });
    });
  }

  if (path.length === 0) {
    path.push({
      title: 'Balanced review',
      activity: 'Mixed practice cycle',
      reason: 'Your learning pattern is stable. Keep a balanced rhythm between review and challenge.',
      priority: 'medium',
    });
  }

  return path.slice(0, 5);
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);
    const signals = await getTrendSignals(userId);
    const path = buildLearningPath(signals);

    return NextResponse.json({
      success: true,
      signals,
      path,
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
