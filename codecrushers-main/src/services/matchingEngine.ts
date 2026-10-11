import { Opportunity, StudentProfile, MatchAnalysis, EligibilityCheckItem } from '../types';

// Skill synonyms and related skills dictionary for intelligent matching
const SKILL_SYNONYMS: Record<string, string[]> = {
  react: ['react.js', 'reactjs', 'frontend', 'javascript', 'next.js', 'web development'],
  javascript: ['js', 'ecmascript', 'frontend', 'typescript', 'react', 'node.js', 'web development'],
  typescript: ['ts', 'javascript', 'react', 'node.js'],
  'html/css': ['html', 'css', 'tailwind css', 'responsive design', 'web development'],
  'tailwind css': ['css', 'html/css', 'bootstrap', 'ui styling'],
  python: ['py', 'data analysis', 'machine learning', 'django', 'fastapi', 'flask', 'scripting'],
  sql: ['postgresql', 'mysql', 'database design', 'sqlite', 'data analysis', 'queries'],
  'node.js': ['nodejs', 'express', 'javascript', 'backend', 'rest apis'],
  'machine learning': ['ml', 'data science', 'scikit-learn', 'deep learning', 'pandas', 'numpy', 'python'],
  pytorch: ['deep learning', 'machine learning', 'neural networks', 'python', 'ai'],
  docker: ['containerization', 'devops', 'kubernetes', 'linux', 'cloud systems'],
  aws: ['cloud computing', 'amazon web services', 'cloud architecture', 'devops'],
  linux: ['bash scripting', 'unix', 'operating systems', 'devops', 'sysadmin'],
  'git & github': ['git', 'github', 'version control', 'collaboration'],
  figma: ['ui/ux design', 'wireframing', 'prototyping', 'product design'],
  'ui/ux design': ['figma', 'wireframing', 'user research', 'design systems', 'product design'],
  'rest apis': ['api integration', 'fastapi', 'node.js', 'backend', 'http'],
  fastapi: ['python', 'rest apis', 'backend', 'web apis'],
  pandas: ['data analysis', 'python', 'data science', 'numpy'],
  tableau: ['data visualization', 'power bi', 'business intelligence', 'data analysis'],
};

function normalizeSkill(str: string): string {
  return str.trim().toLowerCase().replace(/[\s\-_.]+/g, ' ');
}

// Check if profile skill matches required skill (exact or related)
function skillAffinity(profileSkill: string, targetSkill: string): number {
  const normP = normalizeSkill(profileSkill);
  const normT = normalizeSkill(targetSkill);

  if (normP === normT) return 1.0;
  if (normP.includes(normT) || normT.includes(normP)) return 0.85;

  const synonyms = SKILL_SYNONYMS[normT] || [];
  if (synonyms.some((s) => normalizeSkill(s) === normP || normP.includes(normalizeSkill(s)))) {
    return 0.75;
  }

  const pSynonyms = SKILL_SYNONYMS[normP] || [];
  if (pSynonyms.some((s) => normalizeSkill(s) === normT || normT.includes(normalizeSkill(s)))) {
    return 0.75;
  }

  return 0;
}

export function evaluateOpportunityMatch(
  opportunity: Opportunity,
  profile: StudentProfile
): MatchAnalysis {
  const userTechnical = profile.technicalSkills || [];
  const userSoft = profile.softSkills || [];
  const allUserSkills = [...userTechnical, ...userSoft];

  // 1. SKILLS EVALUATION
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let skillsScoreTotal = 0;
  let possibleSkillsWeight = 0;

  // Required skills weight = 1.0 each
  for (const req of opportunity.requiredSkills) {
    possibleSkillsWeight += 1.0;
    let bestMatchScore = 0;
    for (const uSkill of allUserSkills) {
      const affinity = skillAffinity(uSkill, req);
      if (affinity > bestMatchScore) {
        bestMatchScore = affinity;
      }
    }

    if (bestMatchScore >= 0.7) {
      matchedSkills.push(req);
      skillsScoreTotal += bestMatchScore;
    } else {
      missingSkills.push(req);
      skillsScoreTotal += bestMatchScore * 0.5; // Partial credit for related fundamentals
    }
  }

  // Preferred skills weight = 0.4 each
  for (const pref of opportunity.preferredSkills) {
    possibleSkillsWeight += 0.4;
    let bestMatchScore = 0;
    for (const uSkill of allUserSkills) {
      const affinity = skillAffinity(uSkill, pref);
      if (affinity > bestMatchScore) {
        bestMatchScore = affinity;
      }
    }

    if (bestMatchScore >= 0.7) {
      if (!matchedSkills.includes(pref)) {
        matchedSkills.push(pref);
      }
      skillsScoreTotal += bestMatchScore * 0.4;
    } else {
      skillsScoreTotal += bestMatchScore * 0.2;
    }
  }

  const rawSkillsPercentage = possibleSkillsWeight > 0 ? (skillsScoreTotal / possibleSkillsWeight) * 100 : 70;
  const skillsScore = Math.min(100, Math.max(10, Math.round(rawSkillsPercentage)));

  // 2. EDUCATION EVALUATION
  let educationScore = 75;
  const userDegree = profile.education.degree.toLowerCase();
  const userCgpa = parseFloat(profile.education.cgpa) || 7.0;

  const degreeMatches = opportunity.allowedDegrees.some((deg) => {
    const dLower = deg.toLowerCase();
    return userDegree.includes(dLower) || dLower.includes(userDegree) || dLower.includes('any');
  });

  if (degreeMatches) {
    educationScore += 15;
  } else {
    educationScore -= 20;
  }

  if (userCgpa >= opportunity.minCgpa) {
    educationScore += 10;
  } else if (userCgpa >= opportunity.minCgpa - 0.5) {
    educationScore -= 5;
  } else {
    educationScore -= 25;
  }
  educationScore = Math.min(100, Math.max(20, educationScore));

  // 3. EXPERIENCE EVALUATION (Includes projects match)
  let experienceScore = 70;
  const projectTechs = profile.projects.flatMap((p) => p.technologies.map(normalizeSkill));
  const projectTechMatches = opportunity.requiredSkills.filter((s) =>
    projectTechs.some((pt) => pt.includes(normalizeSkill(s)) || normalizeSkill(s).includes(pt))
  );

  if (projectTechMatches.length >= 2) {
    experienceScore += 20;
  } else if (projectTechMatches.length === 1) {
    experienceScore += 10;
  }

  if (opportunity.type === 'Internship') {
    if (profile.experienceLevel === 'Final Year Student' || profile.experienceLevel === 'Pre-final Year') {
      experienceScore += 10;
    }
  } else if (opportunity.type === 'Full-time') {
    if (profile.experienceLevel === 'Fresh Graduate' || profile.experienceLevel === '1-2 Years Experience' || profile.experienceLevel === 'Final Year Student') {
      experienceScore += 10;
    } else {
      experienceScore -= 15;
    }
  }
  experienceScore = Math.min(100, Math.max(30, experienceScore));

  // 4. PREFERENCES EVALUATION (Work Mode, Location, Role)
  let preferencesScore = 80;
  if (profile.preferredWorkMode === 'Any' || profile.preferredWorkMode === opportunity.workMode) {
    preferencesScore += 10;
  } else {
    preferencesScore -= 15;
  }

  const roleKeywords = opportunity.title.toLowerCase();
  const matchedRolePref = profile.preferredRoles.some((r) =>
    roleKeywords.includes(r.toLowerCase()) || r.toLowerCase().includes(roleKeywords)
  );
  if (matchedRolePref) {
    preferencesScore += 10;
  }
  preferencesScore = Math.min(100, Math.max(40, preferencesScore));

  // 5. WEIGHTED OVERALL SCORE
  // Skills: 50%, Education: 20%, Experience: 15%, Preferences: 15%
  const compositeScore = Math.round(
    skillsScore * 0.5 + educationScore * 0.2 + experienceScore * 0.15 + preferencesScore * 0.15
  );
  const overallScore = Math.min(98, Math.max(25, compositeScore));

  // 6. ELIGIBILITY CRITERIA CHECKLIST
  const checklist: EligibilityCheckItem[] = [
    {
      criterion: 'Academic Qualification & Degree',
      passed: degreeMatches,
      userValue: profile.education.degree,
      requiredValue: opportunity.educationRequirement,
      note: degreeMatches
        ? 'Your enrolled degree is accepted by the employer.'
        : 'Employer prefers candidates with ' + opportunity.allowedDegrees.slice(0, 3).join(', '),
    },
    {
      criterion: 'Academic Performance (Minimum CGPA)',
      passed: userCgpa >= opportunity.minCgpa,
      userValue: `${userCgpa.toFixed(1)} CGPA`,
      requiredValue: `Min ${opportunity.minCgpa.toFixed(1)} CGPA`,
      note:
        userCgpa >= opportunity.minCgpa
          ? `Meets the minimum cutoff of ${opportunity.minCgpa.toFixed(1)}.`
          : `Current CGPA (${userCgpa.toFixed(1)}) is slightly below benchmark (${opportunity.minCgpa.toFixed(1)}).`,
    },
    {
      criterion: 'Work Mode & Location Compatibility',
      passed: profile.preferredWorkMode === 'Any' || profile.preferredWorkMode === opportunity.workMode,
      userValue: `${profile.preferredWorkMode} preference`,
      requiredValue: `${opportunity.workMode} (${opportunity.location})`,
      note:
        profile.preferredWorkMode === 'Any' || profile.preferredWorkMode === opportunity.workMode
          ? `Aligns with your work location preference.`
          : `Role is ${opportunity.workMode}, while your profile states ${profile.preferredWorkMode}.`,
    },
    {
      criterion: 'Core Skill Baseline (≥50% Required Skills)',
      passed: matchedSkills.length >= Math.ceil(opportunity.requiredSkills.length * 0.5),
      userValue: `${matchedSkills.length}/${opportunity.requiredSkills.length} skills matched`,
      requiredValue: `At least ${Math.ceil(opportunity.requiredSkills.length * 0.5)} required skills`,
      note:
        matchedSkills.length >= Math.ceil(opportunity.requiredSkills.length * 0.5)
          ? 'Strong foundational skill overlap detected.'
          : 'Further skill development advised before applying.',
    },
  ];

  const failedCount = checklist.filter((c) => !c.passed).length;
  let eligibilityStatus: 'Eligible' | 'Conditional' | 'Ineligible' = 'Eligible';
  let isEligible = true;

  if (failedCount === 0) {
    eligibilityStatus = 'Eligible';
    isEligible = true;
  } else if (failedCount === 1) {
    eligibilityStatus = 'Conditional';
    isEligible = true;
  } else {
    eligibilityStatus = 'Ineligible';
    isEligible = false;
  }

  // 7. AI REASONING TEXT
  let aiReasoning = '';
  if (matchedSkills.length > 0) {
    const topMatched = matchedSkills.slice(0, 3).join(', ');
    aiReasoning = `Your ${topMatched} skills match this opportunity. You meet the education requirement (${profile.education.degree})`;
    if (missingSkills.length > 0) {
      const topMissing = missingSkills.slice(0, 2).join(' and ');
      aiReasoning += `, but learning ${topMissing} could significantly improve your suitability and interview conversion.`;
    } else {
      aiReasoning += ` and possess full core technical alignment. You are an outstanding fit.`;
    }
  } else {
    aiReasoning = `This role requires core expertise in ${opportunity.requiredSkills.slice(0, 2).join(' and ')}. Completing practical projects with these tools will make your profile competitive.`;
  }

  // 8. LEARNING RECOMMENDATIONS
  const learningRecommendations = missingSkills.slice(0, 3).map((skill) => {
    return `Strengthen hands-on competency in ${skill} through practical capstone projects and documentation exercises.`;
  });

  return {
    opportunityId: opportunity.id,
    overallScore,
    skillsScore,
    educationScore,
    experienceScore,
    preferencesScore,
    matchedSkills,
    missingSkills,
    matchingPercentage: overallScore,
    isEligible,
    eligibilityStatus,
    eligibilityChecklist: checklist,
    aiReasoning,
    learningRecommendations,
  };
}
