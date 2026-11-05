export const GLOSSARY_VERSION = 'vi-v1';
export const translationCacheKey = (sourceHash: string) => `tuvi-v4-vi:${GLOSSARY_VERSION}:${sourceHash}`;

export function validateTranslation(data: unknown, expected: { hash: string; key: string; topic: string }): string {
  if (!data || typeof data !== 'object') throw new Error('Tệp bản dịch không hợp lệ.');
  const value = data as Record<string, unknown>;
  if (value.format !== 'tuvi-v4-translation-v1' || value.language !== 'vi' || value.glossaryVersion !== GLOSSARY_VERSION || value.sourceHash !== expected.hash || value.topic !== expected.topic || value.sourceKey !== expected.key || typeof value.translation !== 'string' || !value.translation.trim() || value.translation.length > 120_000) {
    throw new Error('Bản dịch không khớp nội dung, chủ đề hoặc phiên bản từ điển đang xem, hoặc chưa có phần translation.');
  }
  return value.translation;
}
