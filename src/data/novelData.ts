import { Chapter, PART1_CHAPTERS } from './chapters/part1';
export type { Chapter };
import { PART2_CHAPTERS } from './chapters/part2';
import { PART3_CHAPTERS } from './chapters/part3';
import { PART3_EXTRA_CHAPTERS } from './chapters/part3_extra';
import { PART4_CHAPTERS } from './chapters/part4';

export interface NovelMeta {
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  dedicationAr: string;
  dedicationEn: string;
  year: number;
  coverImage: string;
  acknowledgementsAr: string[];
  aboutAuthorAr: string;
}

export const NOVEL_META: NovelMeta = {
  titleAr: 'أغنية الملح والظلال',
  titleEn: 'The Song of Salt and Shadow',
  authorAr: 'سيرين روز',
  authorEn: 'Seren Rose',
  dedicationAr: 'إلى الفتيات اللاتي ما زلن يبحثن عن خيط النور الفضي الخاص بهن.',
  dedicationEn: 'For the girls still searching for their own silver thread of light.',
  year: 2026,
  coverImage: '/public/assets/aistudio/The_Song_of_Salt_and_Shadow_-_Seren_Rose_c41e9165.pdf',
  acknowledgementsAr: [
    'إلى بدايتي الأدبية العزيزة، لقد كلفتِني كل شيء تقريباً خلال الأشهر القليلة الماضية، وأعطيتِني بطريقة ما أكثر من ذلك بالمقابل. لن أنسى أبداً ما تطلبه إحضاركِ لهذا العالم.',
    'إلى زوجي، مرساتي الدائمة. قد لا تكون فهمت الكثير من عالم النشر، لكنك لم تكن بحاجة لذلك. وقفتَ بجانبي على أي حال، تشجعني وتسعد بكل فوز صغير وكأنه فوزك الخاص. شكراً لك على كل لحظة دعم هادئة، وعلى تصديقك بي قبل وجود هذا الكتاب.',
    'إلى صديقتي المفضل نيسا، التي تذكرني كل يوم بالوصول لأعلى والمواصلة، حتى عندما تبدو الأشياء غير ممكنة. أتحقق أننا كنا نتحدث عن هذا الحلم منذ وقت ليس ببعيد. ونحن نعيشه الآن.',
    'إلى ميغان، التي ساعدت في تحويل هذه القصة لشيء أعظم بكثير مما تخيلت. لم تكوني فقط محررتي، بل صوت عقل مستقر وتشجيعي.',
    'وأخيراً إلى طاقمي، قرائي. أوجدتم هذه القصة قبل أن تملك مكاناً في العالم. شكراً لكم جميعاً.'
  ],
  aboutAuthorAr: 'ولدت سيرين روز ونشأت في جنوب غرب ألمانيا. نشأت على الحكايات الخيالية، من الحواف الأكثر ظلمة للأخوين غريم إلى قصص السحر والبحر، وانجذبت للعوالم الخطيرة منذ ذلك الحين. عندما لا تكتب روايتها التالية، فهي تمشي مع كلبها أو تجلب العوالم الخيالية للحياة عبر فنها.'
};

export const ALL_CHAPTERS: Chapter[] = [
  ...PART1_CHAPTERS,
  ...PART2_CHAPTERS,
  ...PART3_CHAPTERS,
  ...PART3_EXTRA_CHAPTERS,
  ...PART4_CHAPTERS
];

export function getChapterById(id: number | string): Chapter | undefined {
  return ALL_CHAPTERS.find(ch => String(ch.id) === String(id));
}

export function searchChapters(query: string): { chapter: Chapter; matchSnippet: string }[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const results: { chapter: Chapter; matchSnippet: string }[] = [];

  for (const chapter of ALL_CHAPTERS) {
    if (
      chapter.titleAr.toLowerCase().includes(q) ||
      chapter.titleEn.toLowerCase().includes(q) ||
      chapter.summaryAr.toLowerCase().includes(q)
    ) {
      results.push({
        chapter,
        matchSnippet: chapter.summaryAr
      });
      continue;
    }

    for (const paragraph of chapter.contentAr) {
      if (paragraph.toLowerCase().includes(q)) {
        const idx = paragraph.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const end = Math.min(paragraph.length, idx + q.length + 40);
        const snippet = (start > 0 ? '...' : '') + paragraph.slice(start, end) + (end < paragraph.length ? '...' : '');
        results.push({
          chapter,
          matchSnippet: snippet
        });
        break;
      }
    }
  }

  return results;
}
