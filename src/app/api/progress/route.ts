import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUserId } from '@/lib/auth';
import { handleError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const userId = requireUserId(req);

    const [mastery, attempts, reviewDue, materials] = await Promise.all([
      prisma.topicMastery.findMany({
        where: { userId },
        include: { topic: { select: { title: true, material: { select: { title: true } } } } },
        orderBy: [{ mastery: 'desc' }],
      }),
      prisma.answerAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.reviewSchedule.findMany({
        where: { userId, dueAt: { lte: new Date() } },
        include: { topic: { select: { title: true } } },
      }),
      prisma.studyMaterial.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length;
    const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    const averageMastery = mastery.length
      ? Math.round(mastery.reduce((sum, item) => sum + item.mastery, 0) / mastery.length)
      : 0;

    const summary = {
      totalTopics: mastery.length,
      averageMastery,
      accuracy,
      reviewDue: reviewDue.length,
      totalMaterials: materials.length,
      totalAttempts,
      correctAttempts,
      activeMaterials: materials.filter((material) => material.status === 'READY' || material.status === 'UPLOADED').length,
    };

    const topics = mastery.map((item) => ({
      topicId: item.topicId,
      title: item.topic.title,
      materialTitle: item.topic.material.title,
      mastery: Math.round(item.mastery),
      confidence: Math.round(item.confidence),
      retention: Math.round(item.retention),
      attemptsCount: item.attemptsCount,
      lastPracticedAt: item.lastPracticedAt,
    }));

    return NextResponse.json({ success: true, summary, topics, recentAttempts: attempts }, { status: 200 });
  } catch (error) {
    const { statusCode, message, code } = handleError(error);
    return NextResponse.json({ success: false, error: message, code }, { status: statusCode });
  }
}
